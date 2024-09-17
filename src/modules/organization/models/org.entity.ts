import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/entities/common.entity';
import { IsNotEmpty } from 'class-validator';
import { OrgImage } from '@/modules/orgImage/models/orgImage.entity';

@Entity('organization') // 表名不能大写
export class Organization extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '营业执照',
  })
  @IsNotEmpty()
  businessLicense: string;

  @Column({
    comment: '法人身份证正面',
  })
  @IsNotEmpty()
  identityCardFrontImg: string;

  @Column({
    comment: '法人身份证反面',
  })
  @IsNotEmpty()
  identityCardBackImg: string;

  @Column({
    type: 'text',
    comment: '标签 以，隔开',
    nullable: true,
  })
  tags: string;

  @Column({
    type: 'text',
    comment: '简介',
    nullable: true,
  })
  description: string;

  @Column({
    comment: '机构名',
    nullable: true,
    default: '',
  })
  name: string;

  @Column({
    comment: 'logo',
    nullable: true,
  })
  logo: string;

  @Column({
    comment: '地址',
    nullable: true,
  })
  address: string;

  @Column({
    comment: '经度',
    nullable: true,
  })
  longitude: string;

  @Column({
    comment: '纬度',
    nullable: true,
  })
  latitude: string;

  @Column({
    comment: '电话',
    nullable: true,
  })
  tel: string;

  // 封面图
  @OneToMany(() => OrgImage, (OrgImage) => OrgImage.orgIdForFront)
  orgFrontImg?: OrgImage[];

  // 室内图
  @OneToMany(() => OrgImage, (OrgImage) => OrgImage.orgIdForRoom)
  orgRoomImg?: OrgImage[];

  // 其他图
  @OneToMany(() => OrgImage, (OrgImage) => OrgImage.orgIdForOther)
  orgOtherImg?: OrgImage[];
}
