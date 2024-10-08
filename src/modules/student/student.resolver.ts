import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  STUDENT_NOT_EXIST,
  SUCCESS,
  UPDATE_ERROR,
} from '@/common/constants/code';
import { StudentInput } from './dto/student.input';
import { CurUserId } from '@/common/decorates/current-user.decorate';
import { StudentResult, StudentResults } from './dto/result-student.output';
import { PageInput } from '@/common/dto/page.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentResult, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getStudentInfo(@CurUserId() id: string): Promise<StudentResult> {
    const result = await this.studentService.findById(id);
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

  @Mutation(() => StudentResult, { description: '更新学员' })
  async commitStudentInfo(
    @Args('params') params: StudentInput,
    @CurUserId() userId: string,
  ): Promise<StudentResult> {
    const res = await this.studentService.updateById(userId, params);
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

  @Query(() => StudentResults)
  async getStudents(@Args('page') page: PageInput): Promise<StudentResults> {
    const { pageNum, pageSize } = page;
    const [results, total] = await this.studentService.findStudents({
      start: (pageNum - 1) * pageSize,
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
