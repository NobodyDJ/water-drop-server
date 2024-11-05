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
  @Mutation(() => Result, { description: '开始排课' })
  async autoCreateSchedule(
    @Args('startDay') startDay: string,
    @Args('endDay') endDay: string,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
  ): Promise<Result> {
    // 1 获取到当前门店下的所有课程
    const [courses] = await this.courseService.findCourses({
      where: {
        org: {
          id: orgId,
        },
      },
      start: 0,
      length: 100,
    });
    const schedules = [];
    // 2 循环课程，并拿到每个课程的可约时间
    for (const course of courses) {
      // {"week":"monday","orderTime":[{"key":7, "startTime":"", "endTime":""}]}]
      const reducibleTime = course.reducibleTime;
      const newReducibleTime: Record<string, OrderTimeType[]> = {};
      for (const rt of reducibleTime) {
        newReducibleTime[rt.week] = rt.orderTime;
      }
      let curDay = dayjs(startDay);
      // 3 从开始的日期到结束的日期，判断是周几，然后就用周几的排课规则（可约时间）
      while (curDay.isBefore(dayjs(endDay).add(1, 'd'))) {
        const curWeek = curDay.format('dddd').toLocaleLowerCase();
        const orderTime = newReducibleTime[curWeek];
        if (orderTime && orderTime.length > 0) {
          for (const ot of orderTime) {
            // 解决重复排课的问题
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
              const schedule = new Schedule();
              schedule.startTime = ot.startTime;
              schedule.endTime = ot.endTime;
              schedule.limitNumber = course.limitNumber;
              schedule.org = course.org;
              schedule.course = course;
              schedule.schoolDay = curDay.toDate();
              schedule.createdBy = userId;
              // 创建课程表实例
              const si = await this.scheduleService.createInstance(schedule);
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
  async getSchedules(@Args('today') today: string): Promise<ScheduleResults> {
    const where: FindOptionsWhere<Schedule> = {
      schoolDay: dayjs(today).toDate(),
    };
    const [results, total] = await this.scheduleService.findAllSchedules({
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
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
