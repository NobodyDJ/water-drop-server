import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './models/org.entity';
import { OrganizationService } from './org.service';
import { OrganizationResolver } from './org.resolver';
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
