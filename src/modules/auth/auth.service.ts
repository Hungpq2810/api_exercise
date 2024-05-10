import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Employee } from 'src/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateEmployeeDto } from '../employee/dto/employee.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    private readonly mailService: MailService
  ) {}

  public async getTokenForUser(employee: Employee): Promise<String> {
    return await this.jwtService.signAsync(
      {
        employeeId: employee.id,
      },
      {
        secret: process.env.AUTH_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      },
    );
  }

  public async getRefreshTokenForUser(employee: Employee): Promise<String> {
    return await this.jwtService.signAsync(
      {
        employeeId: employee.id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      },
    );
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<Employee> {
    const user = await this.employeeRepository.findOne({
      where: {
        email: username,
      },
    });

    if (!user) {
      this.logger.debug(`${username} not found`);
      throw new UnauthorizedException('Email or password is not correct');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException('Email or password is not correct');
    }

    return user;
  }

  public async register(
    input: CreateEmployeeDto,
  ): Promise<Employee | undefined> {
    if (input.password !== input.passwordConfirm) {
      throw new BadRequestException('Password is not the same');
    }
    const employee = new Employee({
      ...input,
      password: await this.hashPassword(input.password),
      birthday: new Date(input.birthday),
    });

    return await this.employeeRepository.save(employee);
  }

  public async updatePassword(
    input: UpdatePasswordDto,
    employee: Employee,
  ): Promise<Employee> {
    const { newPassword, confirmPassword, currentPassword } = input;

    //Check if current password correct
    if (!(await bcrypt.compare(currentPassword, employee.password))) {
      throw new BadRequestException('Password is not correct');
    }

    //Check password confirm
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password confirm is not correct');
    }

    //Check new password
    if (newPassword === currentPassword) {
      throw new BadRequestException('New password is same as current password');
    }

    //Update
    employee.password = await this.hashPassword(newPassword);
    return await this.employeeRepository.save(employee);
  }

  public async forgotPassword(input: ForgotPasswordDto) {
    const { email } = input;
    const employee = await this.employeeRepository.findOne({
      where: {
        email,
      },
    });

    if (!employee) {
      throw new BadRequestException('Email is not found');
    }

    //Generate token
    const token = randomBytes(20).toString('hex');

    employee.passwordResetToken = createHash('sha256').update(token).digest('hex');
    employee.passwordResetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

    await this.employeeRepository.save(employee);

    //Send email  
    await this.mailService.sendForgotPassword(employee, token);


    return {
      message: 'Success. Please check your email to reset password',
    };
  }

  public async resetPassword(input: ResetPasswordDto) {
    const { token, password, passwordConfirm } = input;
    const employee = await this.employeeRepository.findOne({
      where: {
        passwordResetToken: createHash('sha256').update(token).digest('hex'),
        passwordResetTokenExpire: MoreThan(new Date())
      },
    });

    if (!employee) {
      throw new BadRequestException('Token is not correct or expired');
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException('Password confirm is not correct');
    }

    employee.password = await this.hashPassword(password);
    employee.passwordResetToken = null;
    employee.passwordResetTokenExpire = null;

    await this.employeeRepository.save(employee);

    return {
      message: "Success. Password is updated"
    }
  }
}
