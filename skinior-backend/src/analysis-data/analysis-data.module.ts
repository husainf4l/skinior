import { Module } from '@nestjs/common';
import { AnalysisDataController } from './analysis-data.controller';
import { AnalysisDataService } from './analysis-data.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalysisDataController],
  providers: [AnalysisDataService],
  exports: [AnalysisDataService],
})
export class AnalysisDataModule {}
