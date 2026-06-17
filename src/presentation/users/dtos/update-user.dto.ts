import { IsEmail, IsISO8601, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { RegisterUserDto } from "./register-user.dto";


export class UpdateUserDto implements Partial<RegisterUserDto> {

  @IsString()
  @IsNotEmpty()
  readonly credential: string = '';

  @IsString()
  @IsNotEmpty()
  readonly password: string = '';

  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  @IsOptional()
  readonly birthdate: string | undefined;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly email: string | undefined;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @IsOptional()
  readonly gender: string | undefined;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @IsOptional()
  readonly name: string | undefined;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,255}$/)
  @IsNotEmpty()
  @IsOptional()
  readonly newPassword: string | undefined;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly residenceState: string | undefined;
}