import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './models/card.entity';
import { CardService } from './card.service';
import { CardResolver } from './card.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [ConsoleLogger, CardService, CardResolver],
  exports: [CardService],
})
export class CardModule {}
