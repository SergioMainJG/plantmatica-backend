import { IsEmail, IsISO8601, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto{
  @IsString()
  @IsISO8601({strict: true})
  readonly birthdate: string = '';
  
  @IsString()
  @IsEmail()
  readonly email: string = '';
  
  @IsString()
  @MinLength(4)
  readonly gender: string = '';
  
  @IsString()
  @MinLength(5)
  readonly name: string = '';
  
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,255}$/)
  readonly password: string = '';
  
  @IsString()
  readonly residenceState: string = '';
  
}