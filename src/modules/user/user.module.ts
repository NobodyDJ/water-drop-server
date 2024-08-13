import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './models/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [ConsoleLogger, UserService],
    exports: [UserService],
})
export class UserModule { }