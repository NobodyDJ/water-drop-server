import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CardService } from './card.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  CARD_CREATE_FAIL,
  CARD_DEL_FAIL,
  CARD_NOT_EXIST,
  CARD_UPDATE_FAIL,
  SUCCESS,
} from '@/common/constants/code';
import { CardInput } from './dto/card-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { CardResult, CardResults } from './dto/result-card.output';
import { Result } from '@/common/dto/result.type';
import { FindOptionsWhere, Like } from 'typeorm';
import { Card } from './models/card.entity';
import { CurOrgId } from '@/common/decorates/current-org.decorate';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CardResolver {
  constructor(private readonly tempService: CardService) {}

  @Query(() => CardResult, { description: '根据 ID 查询消费卡信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getCardInfo(@Args('id') id: string): Promise<CardResult> {
    const result = await this.tempService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: CARD_NOT_EXIST,
      message: '消费卡信息不存在',
    };
  }

  @Mutation(() => CardResult, { description: '更新消费卡' })
  async commitCardInfo(
    @Args('params') params: CardInput,
    @Args('courseId') courseId: string,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<CardResult> {
    if (!id) {
      const res = await this.tempService.create({
        ...params,
        org: {
          id: orgId,
        },
        course: {
          id: courseId,
        },
        createdBy: userId,
      });
      if (res) {
        return {
          code: SUCCESS,
          message: '创建成功',
        };
      }
      return {
        code: CARD_CREATE_FAIL,
        message: '创建失败',
      };
    }
    const res = await this.tempService.updateById(userId, params);
    if (res) {
      return {
        code: SUCCESS,
        message: '更新成功',
      };
    }
    return {
      code: CARD_UPDATE_FAIL,
      message: '更新失败',
    };
  }

  @Query(() => CardResults)
  async getCards(
    @Args('courseId') courseId: string,
    @CurUserId() userId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<CardResults> {
    const where: FindOptionsWhere<Card> = {
      createdBy: userId,
      course: {
        id: courseId,
      },
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [results] = await this.tempService.findCards({
      where,
    });
    return {
      code: SUCCESS,
      message: '获取成功',
      data: results,
    };
  }

  // 删除消费卡信息 软删除
  @Mutation(() => Result)
  async deleteStudent(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.tempService.findById(id);
    if (result) {
      const delRes = await this.tempService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: '删除成功',
        };
      }
      return {
        code: CARD_DEL_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: CARD_NOT_EXIST,
      message: '消费卡信息不存在',
    };
  }
}
