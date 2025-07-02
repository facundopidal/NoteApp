import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requestToken = this.extractToken(request);
    if (!requestToken) throw new UnauthorizedException('Token no encontrado');

    try {
      const payload: { email: string; sub: string } =
        await this.jwtService.verifyAsync(requestToken, {
          secret: jwtConstants.secret,
        });
      request['user'] = payload;
    } catch {
      throw new ForbiddenException('Token no autorizado');
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request.cookies['access_token'];
  }
}
