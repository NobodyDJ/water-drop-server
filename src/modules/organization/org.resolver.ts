import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizationService } from './org.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ORG_FAIL, ORG_NOT_EXIST, SUCCESS } from '@/common/constants/code';
import { OrganizationInput } from './dto/org-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import {
  OrganizationResult,
  OrganizationResults,
} from './dto/result-org.output';
import { PageInput } from '@/common/dto/page.input';
import { OrgImageService } from '../orgImage/orgImage.service';
import { Result } from '@/common/dto/result.type';
import { FindOptionsWhere, Like } from 'typeorm';
import { Organization } from './models/org.entity';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly orgImageService: OrgImageService,
  ) {}

  @Query(() => OrganizationResult, { description: '根据 ID 查询门店信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getOrganizationInfo(
    @Args('id') id: string,
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
      code: ORG_NOT_EXIST,
      message: '门店信息不存在',
    };
  }

  @Mutation(() => OrganizationResult, { description: '更新门店' })
  async commitOrganizationInfo(
    @Args('params') params: OrganizationInput,
    @CurUserId() userId: string,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<OrganizationResult> {
    if (id) {
      const organization = await this.organizationService.findById(id);
      console.log('organization', organization);
      if (!organization) {
        return {
          code: ORG_NOT_EXIST,
          message: '门店信息不存在',
        };
      }
    }
    // 此处门店关联图片有问题，如果修改原来已经有的图片，会造成数据库中出现脏数据
    // 需要将原来创建的图片删除
    const delRes = await this.orgImageService.deleteByOrg(id);
    if (!delRes) {
      return {
        code: ORG_FAIL,
        message: '图片删除不成功，无法更新门店信息',
      };
    }
    const organization = await this.organizationService.updateById(id, {
      ...params,
      updatedBy: userId,
    });
    if (organization) {
      return {
        code: SUCCESS,
        message: '更新成功',
      };
    }
    const res = await this.organizationService.create({
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
      code: ORG_FAIL,
      message: '操作失败',
    };
  }

  @Query(() => OrganizationResults)
  async getOrganizations(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<OrganizationResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Organization> = { createdBy: userId };
    console.log('name', name);
    if (name) {
      where.name = Like(`%${name}%`);
    }
    console.log('where', where);
    const [results, total] = await this.organizationService.findOrganizations({
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

  // 删除门店信息 软删除
  @Mutation(() => Result)
  async deleteOrganization(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.organizationService.findById(id);
    if (result) {
      const delRes = await this.organizationService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: '删除成功',
        };
      }
      return {
        code: ORG_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: ORG_NOT_EXIST,
      message: '门店信息不存在',
    };
  }
}
