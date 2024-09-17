import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizationService } from './org.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  STUDENT_NOT_EXIST,
  SUCCESS,
  UPDATE_ERROR,
} from '@/common/constants/code';
import { OrganizationInput } from './dto/org-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import {
  OrganizationResult,
  OrganizationResults,
} from './dto/result-org.output';
import { PageInput } from '@/common/dto/page.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => OrganizationResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getOrganizationInfo(
    @CurUserId() id: string,
  ): Promise<OrganizationResult> {
    const result = await this.organizationService.findById(id);
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

  @Mutation(() => OrganizationResult, { description: '更新学员' })
  async commitOrganizationInfo(
    @Args('params') params: OrganizationInput,
    @CurUserId() userId: string,
  ): Promise<OrganizationResult> {
    const res = await this.organizationService.updateById(userId, params);
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

  @Query(() => OrganizationResults)
  async getOrganizations(
    @Args('page') page: PageInput,
  ): Promise<OrganizationResults> {
    const { start, length } = page;
    const [results, total] = await this.organizationService.findOrganizations({
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
