import { CommonEntity } from '@/common/entities/common.entity';
import { CardRecord } from '@/modules/cardRecord/models/card-record.entity';
import { Course } from '@/modules/course/models/course.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Schedule } from '@/modules/schedule/models/schedule.entity';
import { Student } from '@/modules/student/models/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

/**
 * 课程表记录
 */
@Entity('scheduleRecord')
export class ScheduleRecord extends CommonEntity {
  @Column({
    comment: '预约时间',
    type: 'timestamp',
    nullable: true,
  })
  subscribeTime: Date;

  @ManyToOne(() => Student, { cascade: true })
  student: Student;

  @ManyToOne(() => CardRecord, { cascade: true })
  cardRecord: CardRecord;

  @ManyToOne(() => Schedule, { cascade: true })
  schedule: Schedule;

  @ManyToOne(() => Course, { cascade: true })
  course: Course;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  org: Organization;
}
