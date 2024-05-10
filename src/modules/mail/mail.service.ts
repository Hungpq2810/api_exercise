import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Employee } from 'src/entities/employee.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
  ) {}

  public async sendForgotPassword(user: Employee, token: string) {
    await this.mailService.sendMail({
      to: user.email,
      subject: "Reset your password (valid for 10 minutes)",
      template: "./passwordReset",
      context: {
        name: user.name,
        token
      }
    })
  }
}
