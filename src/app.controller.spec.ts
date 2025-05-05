import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          logging: true,
          synchronize: true,
          autoLoadEntities: true,
        }),
        UserModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // it('should return "Hello World!"', () => {
    //   expect(appController.).toBe('Hello World!');
    // });

    it('数据库测试', async () => {
      await appController.create('1');
      const res = await appController.find('1');
      expect(res.name).toBe('水滴超级管理员');
    });
  });
});
