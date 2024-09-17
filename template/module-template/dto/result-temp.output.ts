import { ObjectType } from '@nestjs/graphql';

import { createResult, createResults } from '@/common/dto/result.type';
import { TemplateType } from './temp.type';

@ObjectType()
export class TemplateResult extends createResult(TemplateType) {}

@ObjectType()
export class TemplateResults extends createResults(TemplateType) {}
