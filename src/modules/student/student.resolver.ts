import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { StudentType } from './dto/student.type';
import { Result } from '@/dto/result.type';
import { SUCCESS, UPDATE_ERROR } from '@/common/constants/code';
import { StudentInput } from './dto/student-input.type';

@Resolver()
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentType, { description: '根据 ID 查询学员信息' })
  // 此处的cxt包含了发送请求的请求信息和响应信息
  async getStudentInfo(@Context() cxt: any): Promise<StudentType> {
    console.log('cxt', cxt.req);
    const id = cxt.req.user.id;
    return await this.studentService.findById(id);
  }

  @Mutation(() => Result, { description: '更新学员' })
  async commitStudentInfo(
    @Args('id') id: string,
    @Args('params') params: StudentInput,
  ): Promise<Result> {
    console.log(id, params);
    const res = await this.studentService.updateById(id, params);
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
