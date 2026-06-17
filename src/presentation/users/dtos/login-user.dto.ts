import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";


export class LoginUserDto {
  @ApiProperty({
    description: 'The email address or username of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  credential: string = '';

  @ApiProperty({
    description: 'The password of the user',
    example: 'Secret1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string = '';
}