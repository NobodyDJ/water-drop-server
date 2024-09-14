import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { StudentType } from './dto/student.type';
import { Result } from '@/common/dto/result.type';
import { SUCCESS, UPDATE_ERROR } from '@/common/constants/code';
import { StudentInput } from './dto/student-input.type';
import { CurUserId } from '@/common/decorates/current-user.decorate';

@Resolver()
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentType, { description: '根据 ID 查询学员信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getStudentInfo(@CurUserId() id: string): Promise<StudentType> {
    return await this.studentService.findById(id);
  }

  @Mutation(() => Result, { description: '更新学员' })
  async commitStudentInfo(
    @Args('params') params: StudentInput,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const res = await this.studentService.updateById(userId, params);
    if (res) {
      return {
        code: SUCCESS,
        message: '更新成功',
      };
    }
    return {
      code: UPDATE_ERROR,
      message: '更新成功',
    };
  }
}
