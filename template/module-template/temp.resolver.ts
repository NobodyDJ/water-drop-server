import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TemplateService } from './temp.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  STUDENT_NOT_EXIST,
  SUCCESS,
  UPDATE_ERROR,
} from '@/common/constants/code';
import { TemplateInput } from './dto/temp-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { TemplateResult, TemplateResults } from './dto/result-temp.output';
import { PageInput } from '@/common/dto/page.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query(() => TemplateResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getTemplateInfo(@CurUserId() id: string): Promise<TemplateResult> {
    const result = await this.templateService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: STUDENT_NOT_EXIST,
      message: '用户信息不存在',
    };
  }

  @Mutation(() => TemplateResult, { description: '更新学员' })
  async commitTemplateInfo(
    @Args('params') params: TemplateInput,
    @CurUserId() userId: string,
  ): Promise<TemplateResult> {
    const res = await this.templateService.updateById(userId, params);
    if (res) {
      return {
        code: SUCCESS,
        message: '更新成功',
      };
    }
    return {
      code: UPDATE_ERROR,
      message: '用户信息不存在',
    };
  }

  @Query(() => TemplateResults)
  async getTemplates(@Args('page') page: PageInput): Promise<TemplateResults> {
    const { start, length } = page;
    const [results, total] = await this.templateService.findTemplates({
      start,
      length,
    });
    return {
      code: SUCCESS,
      message: '获取成功',
      data: results,
      page: {
        start,
        length,
        total,
      },
    };
  }
}
