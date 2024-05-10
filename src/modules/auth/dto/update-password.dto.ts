import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({
    example: '123456',
  })
  currentPassword: string;

  @IsString()
  @ApiProperty({
    example: 'abc123456',
  })
  newPassword: string;

  @IsString()
  @ApiProperty({
    example: 'abc123456',
  })
  confirmPassword: string;
}
