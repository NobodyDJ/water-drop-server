import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TemplateService } from './temp.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  COURSE_CREATE_FAIL,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  COURSE_UPDATE_FAIL,
  SUCCESS,
} from '@/common/constants/code';
import { TemplateInput } from './dto/temp-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { TemplateResult, TemplateResults } from './dto/result-temp.output';
import { PageInput } from '@/common/dto/page.input';
import { Result } from '@/common/dto/result.type';
import { FindOptionsWhere, Like } from 'typeorm';
import { Template } from './models/template.entity';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TemplateResolver {
  constructor(private readonly tempService: TemplateService) {}

  @Query(() => TemplateResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getTemplateInfo(@CurUserId() id: string): Promise<TemplateResult> {
    const result = await this.tempService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '课程信息不存在',
    };
  }

  @Mutation(() => TemplateResult, { description: '更新课程' })
  async commitTemplateInfo(
    @Args('params') params: TemplateInput,
    @CurUserId() userId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<TemplateResult> {
    if (!id) {
      const res = await this.tempService.create({
        ...params,
        createdBy: userId,
      });
      if (res) {
        return {
          code: SUCCESS,
          message: '创建成功',
        };
      }
      return {
        code: COURSE_CREATE_FAIL,
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
      code: COURSE_UPDATE_FAIL,
      message: '更新失败',
    };
  }

  @Query(() => TemplateResults)
  async getTemplates(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<TemplateResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Template> = { createdBy: userId };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [results, total] = await this.tempService.findTemplates({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      message: '获取成功',
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
    };
  }

  // 删除课程信息 软删除
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
        code: COURSE_DEL_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '课程信息不存在',
    };
  }
}
