import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmployeeService } from '../employee/employee.service';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), JwtModule.register({}), MailModule],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    AuthService,
    EmployeeService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
