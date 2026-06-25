import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from "~/application/users/entity/user.entity";

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly id: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'User',
  })
  readonly rol: string;

  private constructor(
    id: string,
    name: string,
    email: string,
    rol: string,
  ){
    this.id = id;
    this.name = name;
    this.email = email;
    this.rol = rol;
  }

  static fromEntity(entity: UserEntity): UserResponseDto {
    return new UserResponseDto(
      entity.id!,
      entity.name,
      entity.email,
      entity.rol,
    )
  }

  get getId(){
    return this.id;
  }
  get getName(){
    return this.name;
  }
  get getEmail(){
    return this.email;
  }
  get getRol(){
    return this.rol;
  }
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT authentication token' })
  token!: string;
}

export class DeleteResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the user was deleted successfully' })
  isDeleted!: boolean;
}

export class UpdateResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique identifier of the user' })
  id!: string;

  @ApiProperty({ example: 'newuser@example.com', description: 'The updated email address of the user' })
  email!: string;

  @ApiProperty({ example: 'Jane Doe', description: 'The updated name of the user' })
  name!: string;

  @ApiProperty({ example: 'Female', description: 'The updated gender of the user' })
  gender!: string;

  @ApiProperty({ example: 'Nuevo León', description: 'The updated residence state of the user' })
  residenceState!: string;

  @ApiProperty({ example: '2000-01-01', description: 'The updated birthdate of the user' })
  birthdate!: string;

  @ApiProperty({ example: false, description: 'Indicates if the password was changed during this update' })
  hasPasswordChanged!: boolean;
}