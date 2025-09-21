import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineEventService } from 'src/application/timeline-event/timeline-event.service';
import { ITIMELINE_EVENT_REPOSITORY } from 'src/domain/timeline-event/timeline-event.repository';
import { TimelineEventDB } from 'src/infra/db/timeline-event-db/timeline-event-db.entity';
import { TimelineEventDBRepository } from 'src/infra/db/timeline-event-db/timeline-event-db.repository';
import { TimelineEventController } from 'src/presentation/timeline-event/timeline-event.controller';

@Module({
  providers: [
    TimelineEventService,
    {
      provide: ITIMELINE_EVENT_REPOSITORY,
      useClass: TimelineEventDBRepository,
    },
  ],
  exports: [TimelineEventService],
  imports: [
    TypeOrmModule.forFeature([TimelineEventDB])
  ],
  controllers: [TimelineEventController],
})
export class TimelineEventModule {}