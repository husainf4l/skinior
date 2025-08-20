import { Module } from '@nestjs/common';
import { AnalysisSessionsController } from './analysis-sessions.controller';
import { AnalysisSessionsService } from './analysis-sessions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalysisSessionsController],
  providers: [AnalysisSessionsService],
  exports: [AnalysisSessionsService],
})
export class AnalysisSessionsModule {}
