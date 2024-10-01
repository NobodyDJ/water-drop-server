import { CommonEntity } from '@/common/entities/common.entity';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReducibleTimeType } from '../dto/common.type';
import { Organization } from '@/modules/organization/models/org.entity';

/**
 * 组件
 */
@Entity('course')
export class Course extends CommonEntity {
  @Column({
    comment: '课程名称',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '课程描述',
    nullable: true,
    type: 'text',
  })
  desc: string;

  @Column({
    comment: '适龄人群',
  })
  @IsNotEmpty()
  group: string;

  @Column({
    comment: '适合基础',
  })
  @IsNotEmpty()
  baseAbility: string;

  @Column({
    comment: '限制上课人数',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limitNumber: number;

  @Column({
    comment: '持续时间',
  })
  @IsNotEmpty()
  duration: number;

  @Column({
    comment: '预约信息',
    nullable: true,
  })
  reserveInfo: string;

  @Column({
    comment: '退款信息',
    nullable: true,
  })
  refundInfo: string;

  @Column({
    comment: '其他说明信息',
    nullable: true,
  })
  otherInfo: string;

  @Column('simple-json', {
    comment: '可约时间',
    nullable: true,
  })
  reducibleTime: ReducibleTimeType[];

  // 级联关系只需要添加在两者关系中的一个即可
  // 级联关系添加在操作频繁的实体中
  @ManyToOne(() => Organization, (org) => org.courses, {
    cascade: true,
  })
  org: Organization;
}
