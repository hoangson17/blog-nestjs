import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Authentication, // lấy từ cookie
        ExtractJwt.fromAuthHeaderAsBearerToken(),      // lấy từ Bearer Token
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload?.email) {
      throw new UnauthorizedException();
    }
    const user = await this.repo.findOneBy({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException();
    }

    // đảm bảo roles tồn tại để ACGuard hoạt động
    return {
      ...user,
      roles: user.roles || [],
    };
  }
}
