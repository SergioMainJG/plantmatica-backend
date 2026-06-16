import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRol } from '~/core/users/value-objects/user-rol.vo';
import { UserRolGuard } from '../guard/user-rol.guard';
import { RolProtected } from './rol-protected.decorator';

export const Auth = ( ...rols: UserRol[] ) => {
  return applyDecorators(
    RolProtected(...rols),
    UseGuards(AuthGuard(), UserRolGuard),
  );
}