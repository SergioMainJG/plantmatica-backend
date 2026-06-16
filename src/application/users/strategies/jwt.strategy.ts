import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { JWTPayload } from '../interfaces/jwt-payload.interface';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from '~/application/ports/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { envs } from '~/config/envs/envs.config';

export class JWTStrategy extends PassportStrategy( Strategy ){

  constructor(
    private readonly userRepository: UserRepository
  ){
    super({
      secretOrKey: envs.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  validate = async ( payload: JWTPayload): Promise<UserEntity> => {
    const {id} = payload;
    const user = await this.userRepository.findOneById(id);

    if( !user )
      throw new UnauthorizedException(`Token not valid`);
    
    return user;
  }
}
