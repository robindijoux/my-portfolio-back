import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { AuthService } from '../auth.service';

/**
 * JWT Strategy using aws-jwt-verify library.
 * This strategy provides robust JWT validation with built-in JWKS caching.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates a JWT token by extracting it from the Authorization header
   * and using aws-jwt-verify for validation
   */
  async validate(req: any): Promise<AuthenticatedUser> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers?.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header provided');
      }

      // Extract Bearer token
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Validate token using aws-jwt-verify
      return await this.authService.validateToken(token);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(`Token validation failed: ${error.message}`);
    }
  }
}