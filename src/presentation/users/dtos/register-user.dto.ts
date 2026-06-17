import { IsEmail, IsISO8601, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  readonly birthdate: string = '';

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string = '';

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly gender: string = '';

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly name: string = '';

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,255}$/)
  @IsNotEmpty()
  readonly password: string = '';

  @IsString()
  @IsNotEmpty()
  readonly residenceState: string = '';

}