import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/common.entity';

@Entity('template') // 表名不能大写
export class Template extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '用户名',
    default: '',
  })
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
