import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  STUDENT_NOT_EXIST,
  SUCCESS,
  UPDATE_ERROR,
} from '@/common/constants/code';
import { CourseInput } from './dto/course-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { CourseResult, CourseResults } from './dto/result-course.output';
import { PageInput } from '@/common/dto/page.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => CourseResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getCourseInfo(@CurUserId() id: string): Promise<CourseResult> {
    const result = await this.courseService.findById(id);
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

  @Mutation(() => CourseResult, { description: '更新学员' })
  async commitCourseInfo(
    @Args('params') params: CourseInput,
    @CurUserId() userId: string,
  ): Promise<CourseResult> {
    const res = await this.courseService.updateById(userId, params);
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

  @Query(() => CourseResults)
  async getCourses(@Args('page') page: PageInput): Promise<CourseResults> {
    const { pageNum, pageSize } = page;
    const [results, total] = await this.courseService.findCourses({
      start: (pageNum - 1) * 10,
      length: pageSize,
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
}
