/**
 * Model representing an authenticated user in the system.
 * This is a technical model, not a domain entity.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  sub: string; // AWS Cognito user sub
  username?: string;
  groups?: string[];
  roles?: string[];
}

/**
 * JWT payload structure from AWS Cognito
 */
export interface JwtPayload {
  sub: string;
  email: string;
  iss: string;
  aud: string;
  token_use: string;
  'cognito:groups'?: string[];
  'cognito:username'?: string;
  exp: number;
  iat: number;
}