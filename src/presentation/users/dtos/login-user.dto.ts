import { IsNotEmpty, IsString } from "class-validator";


export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  credential: string = '';
  @IsString()
  @IsNotEmpty()
  password: string = '';
}