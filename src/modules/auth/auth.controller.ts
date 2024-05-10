import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Employee } from 'src/entities/employee.entity';
import { AuthGuardLocal } from './guard/auth-guard.local';
import { AuthGuardJwt } from './guard/auth-guard.jwt';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from '../employee/dto/employee.dto';
import { Response } from 'express';
import { AuthGuardRefreshToken } from './guard/auth-guard.refresh-token';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @UseGuards(AuthGuardLocal)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiBody({
    type: LoginDto,
  })
  async login(
    @CurrentUser() employee: Employee,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getTokenForUser(employee),
      this.authService.getRefreshTokenForUser(employee),
    ]);
    res.cookie('access-token', accessToken, { httpOnly: true });
    res.cookie('refresh-token', refreshToken, { httpOnly: true });
    return {
      accessToken,
      refreshToken,
      user: employee,
    };
  }

  @Post('/register')
  @ApiBadRequestResponse()
  @ApiCreatedResponse()
  @ApiBody({ type: CreateEmployeeDto })
  public async register(@Body() body: CreateEmployeeDto) {
    return await this.authService.register(body).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email or number is already taken');
      }
    });
  }

  @Get('/refresh')
  @UseGuards(AuthGuardRefreshToken)
  @ApiBearerAuth('refresh-token')
  public async refreshToken(
    @CurrentUser() employee: Employee,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.login(employee, res);
  }

  @Post('/logout')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth('token')
  public async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    return {
      message: 'success',
    };
  }

  @Post('/updatePassword')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth('token')
  @ApiBody({ type: UpdatePasswordDto })
  public async updatePassword(
    @CurrentUser() employee: Employee,
    @Body() input: UpdatePasswordDto,
  ) {
    return await this.authService.updatePassword(input, employee);
  }

  @Post('/forgotPassword')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiBody({ type: ForgotPasswordDto })
  public async forgotPassword(@Body() input: ForgotPasswordDto) {
    return await this.authService.forgotPassword(input);
  }

  @Patch('/resetPassword')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiBody({ type: ResetPasswordDto })
  public async resetPassword(@Body() input: ResetPasswordDto) {
    return await this.authService.resetPassword(input);
  }
}
