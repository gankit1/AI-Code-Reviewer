import axios from 'axios';
import { User, IUser } from '../models/user.model';
import { generateTokenPair, TokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/api-error';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    return {
      user: user.toPublicJSON(),
      ...tokens,
    };
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    return {
      user: user.toPublicJSON(),
      ...tokens,
    };
  }

  /**
   * Get GitHub OAuth URL
   */
  getGitHubAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.GITHUB_CALLBACK_URL,
      scope: 'user:email read:user repo',
      state: Math.random().toString(36).substring(7),
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Handle GitHub OAuth callback
   */
  async handleGitHubCallback(code: string) {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw ApiError.badRequest('Failed to get GitHub access token');
    }

    // Get user profile from GitHub
    const profileResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubProfile = profileResponse.data;

    // Get user email if not public
    let email = githubProfile.email;
    if (!email) {
      const emailsResponse = await axios.get(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const primaryEmail = emailsResponse.data.find(
        (e: { primary: boolean }) => e.primary
      );
      email = primaryEmail?.email;
    }

    if (!email) {
      throw ApiError.badRequest('Could not retrieve email from GitHub');
    }

    // Find or create user
    let user = await User.findOne({
      $or: [{ githubId: String(githubProfile.id) }, { email }],
    });

    if (user) {
      // Update GitHub info
      user.githubId = String(githubProfile.id);
      user.githubAccessToken = accessToken;
      user.githubUsername = githubProfile.login;
      user.avatar = githubProfile.avatar_url;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email,
        name: githubProfile.name || githubProfile.login,
        avatar: githubProfile.avatar_url,
        githubId: String(githubProfile.id),
        githubAccessToken: accessToken,
        githubUsername: githubProfile.login,
        isEmailVerified: true,
      });
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    logger.info(`GitHub login: ${user.email} (${githubProfile.login})`);

    return {
      user: user.toPublicJSON(),
      ...tokens,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user.toPublicJSON();
  }
}

export const authService = new AuthService();
