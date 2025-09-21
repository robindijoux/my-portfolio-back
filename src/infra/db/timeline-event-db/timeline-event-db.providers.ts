import { Provider } from '@nestjs/common';
import { ITIMELINE_EVENT_REPOSITORY } from 'src/domain/timeline-event/timeline-event.repository';
import { TimelineEventDBRepository } from './timeline-event-db.repository';

export const timelineEventDbProviders: Provider[] = [
  {
    provide: ITIMELINE_EVENT_REPOSITORY,
    useClass: TimelineEventDBRepository,
  },
];