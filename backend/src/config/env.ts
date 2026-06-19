import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend/ directory first, then fall back to project root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

const envSchema = z.object({
  // Server
  PORT: z.string().default('5001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // MongoDB
  MONGODB_URI: z.string().url().default('mongodb://localhost:27017/ai-code-review'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_CALLBACK_URL: z.string().url().default('http://localhost:5001/api/auth/github/callback'),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default('gpt-4o'),

  // Anthropic (optional)
  ANTHROPIC_API_KEY: z.string().optional(),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(
        (e) => `  - ${e.path.join('.')}: ${e.message}`
      );
      console.error('❌ Environment validation failed:\n' + missingVars.join('\n'));
      console.error('\n📋 Copy .env.example to .env and fill in the values.');
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
