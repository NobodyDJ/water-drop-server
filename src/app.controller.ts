import { Controller, Get } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { User } from './modules/user/models/user.entity';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly userService: UserService) {}

  @Get('/create')
  async create(): Promise<boolean> {
    return await this.userService.create({
      name: '水滴超级管理员',
      desc: '管理员',
      tel: '8800888',
      password: '123456',
      account: 'admin',
    });
  }

  @Get('/del')
  async del(): Promise<boolean> {
    return await this.userService.del('4475688b-780f-4c73-a022-6222d7d72bed');
  }

  @Get('/update')
  async update(): Promise<boolean> {
    return await this.userService.update(
      '16196544-9921-4514-9c12-b3f3d163289b',
      {
        name: '被修改的名称',
      },
    );
  }

  @Get('/find')
  async find(): Promise<User> {
    return await this.userService.find('5f8a1b2d-e82e-497c-9dbc-3db8e749757d');
  }
}
