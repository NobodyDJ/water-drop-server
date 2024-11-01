import { FindOptionsWhere } from 'typeorm';
import { Schedule } from './models/schedule.entity';
import {
  COURSE_CREATE_FAIL,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  COURSE_UPDATE_FAIL,
  SCHEDULE_CREATE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { ScheduleResult, ScheduleResults } from './dto/result-schedule.output';
import { ScheduleInput } from './dto/schedule.input';
import { ScheduleType } from './dto/schedule.type';
import { ScheduleService } from './schedule.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { CourseService } from '../course/course.service';
import { OrderTimeType } from '../course/dto/common.type';
import dayjs from 'dayjs';

@Resolver(() => ScheduleType)
@UseGuards(GqlAuthGuard)
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly courseService: CourseService,
  ) {}

  @Query(() => ScheduleResult)
  async getScheduleInfo(@Args('id') id: string): Promise<ScheduleResult> {
    const result = await this.scheduleService.findById(id);
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

  /**
   *  开始排课
   */
  async autoCreateSchedule(
    @Args('startDay') startDay: string,
    @Args('endDay') endDay: string,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
  ): Promise<Result> {
    const [courses] = await this.courseService.findCourses({
      start: 1,
      length: 100,
      where: {
        org: {
          id: orgId,
        },
      },
    });
    const schedules = [];
    for (const course of courses) {
      const reducibleTime = course.reducibleTime;
      const newReducibleTime: Record<string, OrderTimeType[]> = {};
      for (const rt of reducibleTime) {
        newReducibleTime[rt.week] = rt.orderTime;
      }
      let curDay = dayjs(startDay);
      while (curDay.isBefore(dayjs(endDay))) {
        const curWeek = curDay.format('dddd').toLocaleLowerCase(); // 获取星期几，英文全称
        const orderTime = newReducibleTime[curWeek];
        if (orderTime && orderTime.length > 0) {
          for (const ot of orderTime) {
            // 解决重复排课的问题，先确定排课是否存在
            const [oldSchedule] = await this.scheduleService.findSchedules({
              where: {
                org: {
                  id: orgId,
                },
                startTime: ot.startTime,
                endTime: ot.endTime,
                schoolDay: curDay.toDate(),
                course: {
                  id: course.id,
                },
              },
              start: 0,
              length: 10,
            });
            if (oldSchedule.length === 0) {
              // 将课程时间段加入
              const schedule = new Schedule(); // 实例化
              schedule.startTime = ot.startTime;
              schedule.endTime = ot.endTime;
              schedule.limitNumber = course.limitNumber;
              schedule.org = course.org;
              schedule.course = course;
              schedule.schoolDay = curDay.toDate();
              schedule.createdBy = userId;
              // 创建课程表实例
              const si = await this.scheduleService.createInstance(schedule); // 创建实例存入表中
              schedules.push(si);
            }
          }
        }
        curDay = curDay.add(1, 'd');
      }
    }
    const res = await this.scheduleService.batchCreate(schedules);
    if (res) {
      return {
        code: SUCCESS,
        message: `创建成功，一共新增了 ${schedules.length} 条课程。`,
      };
    }
    return {
      code: SCHEDULE_CREATE_FAIL,
      message: '创建失败',
    };
  }

  @Mutation(() => ScheduleResult)
  async commitScheduleInfo(
    @Args('params') params: ScheduleInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    if (!id) {
      const res = await this.scheduleService.create({
        ...params,
        createdBy: userId,
        org: {
          id: orgId,
        },
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
    const schedule = await this.scheduleService.findById(id);
    if (schedule) {
      const res = await this.scheduleService.updateById(schedule.id, {
        ...params,
        updatedBy: userId,
      });
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
    return {
      code: COURSE_NOT_EXIST,
      message: '课程信息不存在',
    };
  }

  @Query(() => ScheduleResults)
  async getSchedules(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
  ): Promise<ScheduleResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Schedule> = { createdBy: userId };
    const [results, total] = await this.scheduleService.findSchedules({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
    };
  }

  @Mutation(() => Result)
  async deleteSchedule(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.scheduleService.findById(id);
    if (result) {
      const delRes = await this.scheduleService.deleteById(id, userId);
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
      message: '门店信息不存在',
    };
  }
}
