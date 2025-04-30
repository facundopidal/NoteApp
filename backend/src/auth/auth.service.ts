import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Email no encontrado');

    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Constraseña incorrecta');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;

    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { userWithoutPassword, token, refreshToken };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async refresh(token: string) {
    try {
      const payload: { email: string; sub: string } =
        await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });

      return this.jwtService.signAsync(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );
    } catch {
      throw new ForbiddenException('Refresh token inválido');
    }
  }
}
