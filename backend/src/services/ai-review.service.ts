import OpenAI from 'openai';
import { env } from '../config/env';
import { IFinding, IScores } from '../models/review.model';
import { calculateOverallScore } from '../utils/helpers';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface FileToReview {
  filename: string;
  patch: string;
  additions: number;
  deletions: number;
}

interface AIReviewResult {
  findings: IFinding[];
  summary: string;
  scores: IScores;
  tokensUsed: number;
}

const REVIEW_SYSTEM_PROMPT = `You are a Senior Staff Engineer conducting a thorough code review. You have deep expertise in security, performance, and software engineering best practices.

Analyze the provided code diff and return your review as a JSON object with the following structure:

{
  "findings": [
    {
      "severity": "critical|high|medium|low|info",
      "category": "bug|security|performance|best-practice|style|typescript",
      "file": "filename",
      "line": <line_number_or_null>,
      "issue": "Clear description of the issue",
      "suggestion": "Specific actionable fix",
      "codeSnippet": "The problematic code (if applicable)",
      "fixedCode": "The corrected code (if applicable)"
    }
  ],
  "summary": "2-3 sentence overall assessment of the code changes",
  "scores": {
    "security": <0-100>,
    "performance": <0-100>,
    "maintainability": <0-100>,
    "readability": <0-100>
  }
}

Review guidelines:
1. **Bugs**: Logic errors, null pointer risks, race conditions, off-by-one errors
2. **Security**: SQL injection, XSS, CSRF, hardcoded secrets, insecure auth, data exposure
3. **Performance**: N+1 queries, unnecessary re-renders, memory leaks, blocking operations, missing indexes
4. **Best Practices**: React hooks rules, proper error handling, SOLID principles, DRY
5. **TypeScript**: Missing types, any abuse, improper generics, type safety gaps
6. **Style/Clean Code**: Naming conventions, dead code, excessive complexity, readability

Severity guidelines:
- critical: Will cause production failures, data loss, or security breaches
- high: Likely to cause bugs in production or significant performance issues
- medium: Code smell that could lead to problems over time
- low: Minor improvements for maintainability
- info: Suggestions and praise for good patterns

Be precise with line numbers. Focus on actionable findings. Don't flag trivial style issues.
Return ONLY valid JSON, no markdown formatting.`;

export class AIReviewService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  /**
   * Review a set of files using AI
   */
  async reviewFiles(files: FileToReview[]): Promise<AIReviewResult> {
    const startTime = Date.now();

    // Filter out binary/non-reviewable files
    const reviewableFiles = files.filter(
      (f) =>
        f.patch &&
        !f.filename.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|lock)$/i) &&
        !f.filename.includes('node_modules') &&
        !f.filename.includes('.min.')
    );

    if (reviewableFiles.length === 0) {
      return {
        findings: [],
        summary: 'No reviewable code changes found in this pull request.',
        scores: { security: 100, performance: 100, maintainability: 100, readability: 100, overall: 100 },
        tokensUsed: 0,
      };
    }

    // Build the code context
    const codeContext = reviewableFiles
      .map(
        (f) =>
          `### File: ${f.filename}\n` +
          `Changes: +${f.additions} -${f.deletions}\n` +
          `\`\`\`diff\n${this.truncatePatch(f.patch, 3000)}\n\`\`\``
      )
      .join('\n\n');

    try {
      const completion = await this.openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: REVIEW_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Review the following code changes from a pull request:\n\n${codeContext}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const tokensUsed =
        (completion.usage?.prompt_tokens || 0) +
        (completion.usage?.completion_tokens || 0);

      const parsed = JSON.parse(responseText);

      // Normalize findings
      const findings: IFinding[] = (parsed.findings || []).map(
        (f: Partial<IFinding>) => ({
          id: uuidv4(),
          severity: f.severity || 'info',
          category: f.category || 'best-practice',
          file: f.file || 'unknown',
          line: f.line || undefined,
          endLine: f.endLine || undefined,
          issue: f.issue || 'No description',
          suggestion: f.suggestion || 'No suggestion',
          codeSnippet: f.codeSnippet || undefined,
          fixedCode: f.fixedCode || undefined,
        })
      );

      // Calculate scores
      const scores: IScores = {
        security: Math.max(0, Math.min(100, parsed.scores?.security ?? 100)),
        performance: Math.max(0, Math.min(100, parsed.scores?.performance ?? 100)),
        maintainability: Math.max(0, Math.min(100, parsed.scores?.maintainability ?? 100)),
        readability: Math.max(0, Math.min(100, parsed.scores?.readability ?? 100)),
        overall: 0,
      };
      scores.overall = calculateOverallScore(scores);

      const processingTime = Date.now() - startTime;

      logger.info(
        `AI Review completed: ${findings.length} findings, score: ${scores.overall}/100, ` +
          `tokens: ${tokensUsed}, time: ${processingTime}ms`
      );

      return {
        findings,
        summary: parsed.summary || 'Review completed.',
        scores,
        tokensUsed,
      };
    } catch (error: unknown) {
      logger.error('AI review failed:', error);
      throw error;
    }
  }

  /**
   * Explain a code file using AI
   */
  async explainCode(code: string, filename: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior engineer explaining code to a team member. Be clear, concise, and helpful. Cover: purpose, flow, key patterns used, potential risks, and optimization opportunities.',
        },
        {
          role: 'user',
          content: `Explain this file (${filename}):\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate explanation.';
  }

  /**
   * Suggest refactoring for code
   */
  async suggestRefactoring(
    code: string,
    filename: string
  ): Promise<{ before: string; after: string; reason: string }[]> {
    const completion = await this.openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a senior engineer suggesting refactoring improvements. Return a JSON array of suggestions, each with "before" (original code), "after" (refactored code), and "reason" (why this improves the code). Return ONLY valid JSON.`,
        },
        {
          role: 'user',
          content: `Suggest refactoring for (${filename}):\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content || '{"suggestions":[]}';
    const parsed = JSON.parse(responseText);
    return parsed.suggestions || [];
  }

  /**
   * Generate unit tests for code
   */
  async generateTests(code: string, filename: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a testing expert. Generate comprehensive Jest/Vitest unit tests for the provided code. Include edge cases, error scenarios, and mock external dependencies. Use TypeScript.',
        },
        {
          role: 'user',
          content: `Generate unit tests for (${filename}):\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    return completion.choices[0]?.message?.content || '// Unable to generate tests';
  }

  /**
   * Truncate patch to stay within token limits
   */
  private truncatePatch(patch: string, maxChars: number): string {
    if (patch.length <= maxChars) return patch;
    return patch.slice(0, maxChars) + '\n... (truncated)';
  }
}

export const aiReviewService = new AIReviewService();
