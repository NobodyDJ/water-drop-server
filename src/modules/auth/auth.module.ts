import { Module, ConsoleLogger } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  providers: [ConsoleLogger, AuthService, AuthResolver],
  exports: [AuthService],
})
export class UserModule {}
