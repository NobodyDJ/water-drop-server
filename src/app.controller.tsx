import { Controller, Get, Res } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { User } from './modules/user/models/user.entity';
import { AppService } from './app.service';
import { HelloWorld } from './HelloWorld';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  @Get('/create')
  async create(id: string): Promise<boolean> {
    return await this.userService.create({
      id,
      code: '123',
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
  async find(id: string): Promise<User> {
    return await this.userService.find(id);
  }

  @Get('/getHello')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/html')
  async html(@Res() res) {
    const name = 'water-drop';
    const message = 'Hello World!！！！';
    const html = ReactDOMServer.renderToString(
      <HelloWorld name={name} message={message} />,
    );
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${message}</title>
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  }
}
