import { AuthGuard } from '@nestjs/passport';

export class AuthGuardRefreshToken extends AuthGuard('jwt-refresh-token') {}
