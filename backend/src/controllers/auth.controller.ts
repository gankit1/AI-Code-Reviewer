import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { env } from '../config/env';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async githubAuth(_req: Request, res: Response): Promise<void> {
    const url = authService.getGitHubAuthUrl();
    res.json({ success: true, data: { url } });
  }

  async githubCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        res.status(400).json({ success: false, error: { message: 'Missing code parameter' } });
        return;
      }

      const result = await authService.handleGitHubCallback(code);

      // Redirect to frontend with tokens
      const params = new URLSearchParams({
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });

      res.redirect(`${env.FRONTEND_URL}/callback?${params.toString()}`);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getUserById(req.user!._id);
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
