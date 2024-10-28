import { ObjectType } from '@nestjs/graphql';

import { createResult } from '@/common/dto/result.type';
import { WxConfig } from './wxConfig.type';

@ObjectType()
export class WxConfigResult extends createResult(WxConfig) {}
