import { UserEntity } from "~/application/users/entity/user.entity";

export class UserResponseDto {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly rol: string,
  ){}

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