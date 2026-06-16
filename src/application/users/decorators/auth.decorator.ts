import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRol } from '~/core/users/value-objects/user-rol.vo';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { UserRolGuard } from '../guard/user-rol.guard';
import { RolProtected } from './rol-protected.decorator';

export const Auth = (...rols: UserRol[]) => {
  return applyDecorators(
    RolProtected(...rols),
    UseGuards(JwtAuthGuard, UserRolGuard),
  );
}