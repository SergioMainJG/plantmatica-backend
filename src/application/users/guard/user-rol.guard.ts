import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable} from 'rxjs';
import { Reflector } from "@nestjs/core";
import { META_ROLS } from "../decorators/rol-protected.decorator";
import { UserEntity } from "../entity/user.entity";



@Injectable()
export class UserRolGuard implements CanActivate{
  
  constructor(
    private readonly reflector: Reflector,
  ){}

  canActivate = (
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> => {
    const validRols: string[] = this.reflector.get(META_ROLS, ctx.getHandler());

    if( !validRols ) return true;
    if( validRols.length === 0 ) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as UserEntity;

    if( !user )
      throw new BadRequestException(`User not found (request)`);

    if(validRols.includes( user.rol))
      return true;

    throw new ForbiddenException(`User ${user.name} need a valid rol: [${validRols}]`)
  }
} 