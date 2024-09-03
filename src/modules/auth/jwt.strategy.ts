import { JWT_SECRET } from '@/common/constants/aliyun';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // token获取的地方
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }
  async validate(user): Promise<any> {
    if (!user.id) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
