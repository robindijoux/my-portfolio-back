import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimelineEvent } from 'src/domain/timeline-event/timeline-event.entity';
import { ITimelineEventRepository } from 'src/domain/timeline-event/timeline-event.repository';
import { TimelineEventDB } from './timeline-event-db.entity';
import { fromDB, toDB } from 'src/application/timeline-event/timeline-event.mapper';

@Injectable()
export class TimelineEventDBRepository implements ITimelineEventRepository {
  constructor(
    @InjectRepository(TimelineEventDB)
    private timelineEventRepository: Repository<TimelineEventDB>,
  ) {}

  async findAll(): Promise<TimelineEvent[]> {
    const rows = await this.timelineEventRepository.find({
      order: { year: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(fromDB);
  }

  async findById(id: string): Promise<TimelineEvent | null> {
    const row = await this.timelineEventRepository.findOne({ where: { id } });
    return row ? fromDB(row) : null;
  }

  async findByType(type: string): Promise<TimelineEvent[]> {
    const rows = await this.timelineEventRepository.find({
      where: { type: type as 'education' | 'achievement' | 'work' },
      order: { year: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(fromDB);
  }

  async save(timelineEvent: TimelineEvent): Promise<TimelineEvent> {
    const timelineEventDB = this.timelineEventRepository.create(toDB(timelineEvent));
    const saved = await this.timelineEventRepository.save(timelineEventDB);
    return fromDB(saved);
  }

  async delete(id: string): Promise<void> {
    await this.timelineEventRepository.delete(id);
  }
}