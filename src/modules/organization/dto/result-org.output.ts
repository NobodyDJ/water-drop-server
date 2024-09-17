import { ObjectType } from '@nestjs/graphql';

import { createResult, createResults } from '@/common/dto/result.type';
import { OrganizationType } from './org.type';

@ObjectType()
export class OrganizationResult extends createResult(OrganizationType) {}

@ObjectType()
export class OrganizationResults extends createResults(OrganizationType) {}
