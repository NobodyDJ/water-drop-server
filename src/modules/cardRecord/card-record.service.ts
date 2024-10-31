import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';
import { CardRecord } from './models/card-record.entity';
import { CardService } from '../card/card.service';
import { StudentService } from '../student/student.service';
import dayjs from 'dayjs';
@Injectable()
export class CardRecordService {
  constructor(
    @InjectRepository(CardRecord)
    private readonly cardRecordRepository: Repository<CardRecord>,
    private readonly cardService: CardService,
    private readonly studentService: StudentService,
  ) {}

  // 给消费者添加多张消费卡
  async addCardForStudent(
    studentId: string,
    cardIds: string[],
  ): Promise<boolean> {
    const crs = [];
    for (let i = 0; i < cardIds.length; i++) {
      const cardId = cardIds[i];
      const card = await this.cardService.findById(cardId);
      const student = await this.studentService.findById(studentId);
      const cardRecord = new CardRecord();
      cardRecord.buyTime = dayjs().toDate();
      cardRecord.startTime = dayjs().toDate(); // 自定义 T+1
      cardRecord.endTime = dayjs().add(card.validityDay, 'd').toDate();
      cardRecord.residueTime = card.time;
      cardRecord.card = card;
      cardRecord.student = student;
      cardRecord.course = card.course;
      cardRecord.org = card.org;
      // 创建存储的实例
      const cr = await this.cardRecordRepository.create(cardRecord);
      crs.push(cr);
    }
    const res = await this.cardRecordRepository.save(crs);
    if (res) {
      return true;
    }
    return false;
  }

  async create(entity: DeepPartial<CardRecord>): Promise<boolean> {
    const res = await this.cardRecordRepository.save(
      this.cardRecordRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<CardRecord> {
    return this.cardRecordRepository.findOne({
      where: {
        id,
      },
      relations: ['course', 'org'],
    });
  }

  async updateById(
    id: string,
    entity: DeepPartial<CardRecord>,
  ): Promise<boolean> {
    const existEntity = await this.findById(id);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.cardRecordRepository.save(existEntity);
    if (res) {
      return true;
    }
    return false;
  }

  async findCardRecords({
    start,
    length,
    where,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<CardRecord>;
  }): Promise<[CardRecord[], number]> {
    return this.cardRecordRepository.findAndCount({
      take: length,
      skip: start,
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['org', 'card'],
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res1 = await this.cardRecordRepository.update(id, {
      deletedBy: userId,
    });
    if (res1) {
      const res = await this.cardRecordRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
