import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'resetpasswordtoken',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "abc123456"
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "abc123456"
  })
  passwordConfirm: string;
}
