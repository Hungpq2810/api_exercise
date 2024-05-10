import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from 'src/enums';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'Hưng',
  })
  @IsString()
  @Length(5, 50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'hungphiquoc@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(8, 50)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(8, 50)
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    example: '0886077888',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'male',
  })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    example: 'Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '2000-10-10',
  })
  @IsString()
  @IsNotEmpty()
  birthday: string;

}
