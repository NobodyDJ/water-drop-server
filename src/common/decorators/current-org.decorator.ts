import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// 自定义装饰器
// 获取请求中的用户Id
export const CurOrgId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context); // 获取所有来自请求的参数
    const orgId = ctx.getContext().req.headers.orgid;
    return orgId;
  },
);
