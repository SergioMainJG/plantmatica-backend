import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    description: 'The email or username credential of the account to delete',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  credential: string = '';
}