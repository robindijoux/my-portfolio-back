import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../infra/auth/auth.service';
import { JwtStrategy } from '../../infra/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard, PassportModule],
})
export class AuthModule {}