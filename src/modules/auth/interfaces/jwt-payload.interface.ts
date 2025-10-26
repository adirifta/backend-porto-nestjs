export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number; // issued at (optional)
  exp?: number; // expiration time (optional)
}