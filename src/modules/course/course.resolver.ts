import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  COURSE_CREATE_FAIL,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  COURSE_UPDATE_FAIL,
  SUCCESS,
} from '@/common/constants/code';
import { PartialCourseInput } from './dto/course-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { CourseResult, CourseResults } from './dto/result-course.output';
import { PageInput } from '@/common/dto/page.input';
import { Result } from '@/common/dto/result.type';
import { FindOptionsWhere, Like } from 'typeorm';
import { Course } from './models/course.entity';
import { CurOrgId } from '@/common/decorates/current-org.decorate';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => CourseResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getCourseInfo(@Args('id') id: string): Promise<CourseResult> {
    const result = await this.courseService.findById(id);
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

  @Mutation(() => CourseResult, { description: '更新课程' })
  async commitCourseInfo(
    @Args('params') params: PartialCourseInput,
    @CurUserId() userId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<CourseResult> {
    if (!id) {
      const res = await this.courseService.create({
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
    const res = await this.courseService.updateById(id, params);
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

  @Query(() => CourseResults)
  async getCourses(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @Args('name', { nullable: true }) name?: string,
    @CurOrgId() orgId: string,
  ): Promise<CourseResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Course> = { createdBy: userId, orgId };
    console.log('name', name);
    if (name) {
      where.name = Like(`%${name}%`);
    }
    console.log('where', where);
    const [results, total] = await this.courseService.findCourses({
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
  async deleteCourse(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.courseService.findById(id);
    if (result) {
      const delRes = await this.courseService.deleteById(id, userId);
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
