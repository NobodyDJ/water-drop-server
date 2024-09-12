import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('student') // 表名不能大写
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '用户名',
    default: '',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '头像',
    default: '',
  })
  avatar: string;

  @Column({
    comment: '手机号',
    default: '',
  })
  tel: string;

  @Column({
    comment: '密码',
    nullable: true,
  })
  password: string;

  @Column({
    comment: '账户信息',
    nullable: true,
  })
  account: string;
}
