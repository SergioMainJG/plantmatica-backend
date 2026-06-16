import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '~/application/ports/user.repository';
import { JWTPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const token = this.extractToken(req);
    if (!token) throw new UnauthorizedException('Token not provided');

    let payload: JWTPayload;
    try {
      payload = await this.jwtService.verifyAsync<JWTPayload>(token);
    } catch {
      throw new UnauthorizedException('Token not valid');
    }

    const user = await this.userRepository.findOneById(payload.id);
    if (!user) throw new UnauthorizedException('Token not valid');

    req.user = user;
    return true;
  }

  private extractToken(req: any): string | undefined {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}