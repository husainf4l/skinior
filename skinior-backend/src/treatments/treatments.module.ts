import { Module } from '@nestjs/common';
import { TreatmentsController } from './treatments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TreatmentsController],
  providers: [],
  exports: [],
})
export class TreatmentsModule {}
