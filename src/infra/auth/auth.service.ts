import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { AuthenticatedUser } from './models/authenticated-user.model';

/**
 * Authentication service using AWS JWT Verify library.
 * This service provides secure and efficient JWT validation for AWS Cognito tokens.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtVerifier: ReturnType<typeof CognitoJwtVerifier.create>;

  constructor(private configService: ConfigService) {
    const userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID');
    const clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');

    if (!userPoolId) {
      throw new Error('AWS Cognito configuration is missing. Please check your environment variables.');
    }

    // Create the JWT verifier with aws-jwt-verify
    // Note: If clientId is not provided, it will accept tokens from any client in the user pool
    this.jwtVerifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'access', // We expect access tokens
      clientId: clientId || null, // Allow any client if not specified
      // Optional: Add groups validation if needed
      // groups: ['admin', 'user'],
    });

    this.logger.log(`JWT Verifier initialized for User Pool: ${userPoolId}${clientId ? ` with Client ID: ${clientId}` : ' (any client)'}`);
  }

  /**
   * Validates a JWT token using aws-jwt-verify library
   * This method provides excellent performance with built-in JWKS caching
   */
  async validateToken(token: string): Promise<AuthenticatedUser> {
    try {
      // Verify the token with aws-jwt-verify
      const payload = await this.jwtVerifier.verify(token);
      
      this.logger.debug(`Token validated successfully for user: ${payload.sub}`);
      
      return this.mapPayloadToUser(payload);
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Maps the JWT payload to our AuthenticatedUser model
   */
  private mapPayloadToUser(payload: any): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      sub: payload.sub,
      username: payload.username || payload['cognito:username'],
      groups: payload['cognito:groups'] || [],
    };
  }

  /**
   * Hydrates the JWT verifier cache for better performance
   * Call this during application startup
   */
  async hydrateCache(): Promise<void> {
    try {
      await this.jwtVerifier.hydrate();
      this.logger.log('JWT verifier cache hydrated successfully');
    } catch (error) {
      this.logger.warn(`Failed to hydrate JWT verifier cache: ${error.message}`);
    }
  }
}