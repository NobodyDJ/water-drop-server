import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './models/org.entity';
import { OrganizationService } from './org.service';
import { OrganizationResolver } from './org.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [ConsoleLogger, OrganizationService, OrganizationResolver],
  exports: [OrganizationService],
})
export class OrganizationModule {}
