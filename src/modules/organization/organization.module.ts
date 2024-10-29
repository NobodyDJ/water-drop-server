import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './models/organization.entity';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { OrgImage } from '../orgImage/models/orgImage.entity';
import { OrgImageService } from '../orgImage/orgImage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrgImage])],
  providers: [
    ConsoleLogger,
    OrganizationService,
    OrganizationResolver,
    OrgImageService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
