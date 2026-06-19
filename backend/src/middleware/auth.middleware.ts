import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/api-error';
import { User } from '../models/user.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & { _id: string };
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    req.user = {
      ...payload,
      _id: payload.userId,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expired'));
    } else {
      next(ApiError.unauthorized('Authentication failed'));
    }
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
}
