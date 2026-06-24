import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsNotEmptyObject, ValidateNested, Type } from "class-validator";
import { PermissionsDto } from './permissions.dto';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The birthdate of the user in ISO8601 format (YYYY-MM-DD)',
    example: '2000-01-01',
  })
  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  readonly birthdate: string = '';

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string = '';

  @ApiProperty({
    description: 'The gender of the user (at least 4 characters)',
    example: 'Male',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly gender: string = '';

  @ApiProperty({
    description: 'The full name of the user (at least 5 characters)',
    example: 'John Doe',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly name: string = '';

  @ApiProperty({
    description: 'The password (must contain at least 1 uppercase, 1 number, and be between 8 and 255 chars)',
    example: 'Secret1234',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,255}$/)
  @IsNotEmpty()
  readonly password: string = '';

  @ApiProperty({
    description: 'The residence state of the user',
    example: 'CDMX',
  })
  @IsString()
  @IsNotEmpty()
  readonly residenceState: string = '';
  
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(()=> PermissionsDto)
  readonly permissions: PermissionsDto;
}