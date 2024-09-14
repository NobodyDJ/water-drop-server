import { Module, ConsoleLogger } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { StudentService } from '../student/student.service';
import { Student } from '../student/models/student.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '@/common/constants/aliyun';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: 60 * 60 * 24 + 's',
      },
    }),
    TypeOrmModule.forFeature([User, Student]),
  ],
  providers: [
    ConsoleLogger,
    AuthService,
    AuthResolver,
    UserService,
    StudentService,
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule {}
export { AuthService };
