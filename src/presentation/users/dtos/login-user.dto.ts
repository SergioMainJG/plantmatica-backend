import { IsString } from "class-validator";


export class LoginUserDto {
  @IsString()
  credential: string = '';
  @IsString()
  password: string = '';
}