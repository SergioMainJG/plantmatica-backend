import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { RegisterUserDto } from "./register-user.dto";


export class UpdateUserDto implements Partial<RegisterUserDto> {

  @ApiProperty({
    description: 'The current email address or username credential of the account to update',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly credential: string = '';

  @ApiProperty({
    description: 'The current password of the user (to authorize the update)',
    example: 'Secret1234',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string = '';

  @ApiPropertyOptional({
    description: 'The new birthdate of the user in ISO8601 format (YYYY-MM-DD)',
    example: '2000-01-01',
  })
  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  @IsOptional()
  readonly birthdate: string | undefined;

  @ApiPropertyOptional({
    description: 'The new email address of the user',
    example: 'newuser@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly email: string | undefined;

  @ApiPropertyOptional({
    description: 'The new gender of the user (at least 4 characters)',
    example: 'Female',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @IsOptional()
  readonly gender: string | undefined;

  @ApiPropertyOptional({
    description: 'The new full name of the user (at least 5 characters)',
    example: 'Jane Doe',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @IsOptional()
  readonly name: string | undefined;

  @ApiPropertyOptional({
    description: 'The new password of the user (must contain at least 1 uppercase, 1 number, and be between 8 and 255 chars)',
    example: 'NewSecret1234',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,255}$/)
  @IsNotEmpty()
  @IsOptional()
  readonly newPassword: string | undefined;

  @ApiPropertyOptional({
    description: 'The new residence state of the user',
    example: 'Nuevo León',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly residenceState: string | undefined;
}