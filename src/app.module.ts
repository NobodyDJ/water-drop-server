import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { OSSModule } from './modules/oss/oss.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'water-drop',
      entities: [`${__dirname}/../modules/**/*.entity{.ts,.js}`],
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    // 注册graphql
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql', // 值为true会将schema放到内存
    }),
    UserModule,
    OSSModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
