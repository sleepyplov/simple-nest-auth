import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, RefreshToken } from '@prisma/client';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private securityService: SecurityService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.securityService.verifyPasswordHash(user.password, password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const accessToken = this.jwtService.sign({ sub: user.id });
    return { accessToken };
  }

  async register(dto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hash = await this.securityService.generatePasswordHash(dto.password);
    const user = await this.usersService.create({ ...dto, password: hash });
    const tokens = this.generateTokenPair(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userRes } = user;
    return { user: userRes, ...tokens };
  }

  async generateTokenPair(user: User, token?: string) {
    let previousToken: RefreshToken | undefined;
    if (token) {
      previousToken = await this.getRefreshToken(user, token);
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    if (previousToken) {
      await this.prismaService.refreshToken.update({
        where: { id: previousToken.id },
        data: { blacklisted: true },
      });
    }

    const refreshToken = await this.prismaService.refreshToken.create({
      data: {
        token: this.securityService.generateSecureRandomToken(),
        // FIXME: add refresh lifespan to config
        expiry: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
        user: {
          connect: { id: user.id },
        },
        family: previousToken
          ? {
              create: {},
            }
          : { connect: { id: previousToken.familyId } },
      },
    });
    return { accessToken, refreshToken: refreshToken.token };
  }

  async logout(user: User, token: string) {
    const refreshToken = await this.getRefreshToken(user, token);
    await this.prismaService.refreshToken.update({
      where: { id: refreshToken.id },
      data: { blacklisted: true },
    });
  }

  private async getRefreshToken(user: User, token: string) {
    const refreshToken = await this.prismaService.refreshToken.findFirst({
      where: { token: token },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }
    if (
      refreshToken.userId !== user.id ||
      refreshToken?.expiry < new Date() ||
      refreshToken.blacklisted
    ) {
      await this.prismaService.refreshTokenFamily.delete({
        where: { id: refreshToken.familyId },
      });
      throw new UnauthorizedException('Invalid or expired token');
    }
    return refreshToken;
  }
}
