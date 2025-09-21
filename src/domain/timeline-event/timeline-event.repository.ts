import { TimelineEvent } from './timeline-event.entity';

export interface ITimelineEventRepository {
  findAll(): Promise<TimelineEvent[]>;
  findById(id: string): Promise<TimelineEvent | null>;
  findByType(type: string): Promise<TimelineEvent[]>;
  save(timelineEvent: TimelineEvent): Promise<TimelineEvent>;
  delete(id: string): Promise<void>;
}

export const ITIMELINE_EVENT_REPOSITORY = 'TimelineEventRepository';