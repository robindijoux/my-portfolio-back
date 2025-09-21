import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  type ITimelineEventRepository,
  ITIMELINE_EVENT_REPOSITORY,
} from 'src/domain/timeline-event/timeline-event.repository';
import {
  CreateTimelineEventDTO,
  UpdateTimelineEventDTO,
} from 'src/presentation/timeline-event/timeline-event.dto';
import { fromCreateDTO, toDTO, fromUpdateDTO } from './timeline-event.mapper';

@Injectable()
export class TimelineEventService {
  constructor(
    @Inject(ITIMELINE_EVENT_REPOSITORY) 
    private timelineEventRepository: ITimelineEventRepository,
  ) {}

  async list() {
    const entities = await this.timelineEventRepository.findAll();
    return entities.map((entity) => toDTO(entity));
  }

  async create(createDto: CreateTimelineEventDTO) {
    let entity = fromCreateDTO(createDto);
    entity.id = crypto.randomUUID();
    
    const savedEntity = await this.timelineEventRepository.save(entity);
    return toDTO(savedEntity);
  }

  async findById(id: string) {
    const entity = await this.timelineEventRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Timeline event with ID ${id} not found`);
    }
    return toDTO(entity);
  }

  async findByType(type: string) {
    const entities = await this.timelineEventRepository.findByType(type);
    return entities.map((entity) => toDTO(entity));
  }

  async update(id: string, updateDto: UpdateTimelineEventDTO) {
    const existingEntity = await this.timelineEventRepository.findById(id);
    if (!existingEntity) {
      throw new NotFoundException(`Timeline event with ID ${id} not found`);
    }

    const updatedEntity = fromUpdateDTO(existingEntity, updateDto);
    const savedEntity = await this.timelineEventRepository.save(updatedEntity);
    return toDTO(savedEntity);
  }

  async delete(id: string) {
    const entity = await this.timelineEventRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Timeline event with ID ${id} not found`);
    }
    
    await this.timelineEventRepository.delete(id);
  }
}