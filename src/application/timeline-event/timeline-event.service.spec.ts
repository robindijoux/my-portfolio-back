import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TimelineEventService } from './timeline-event.service';
import { ITimelineEventRepository, ITIMELINE_EVENT_REPOSITORY } from 'src/domain/timeline-event/timeline-event.repository';
import { TimelineEvent } from 'src/domain/timeline-event/timeline-event.entity';
import { CreateTimelineEventDTO, UpdateTimelineEventDTO } from 'src/presentation/timeline-event/timeline-event.dto';

describe('TimelineEventService', () => {
  let service: TimelineEventService;
  let repository: jest.Mocked<ITimelineEventRepository>;

  const mockTimelineEvent = new TimelineEvent(
    '123e4567-e89b-12d3-a456-426614174000',
    '2023',
    'Bachelor Degree',
    'Completed Bachelor of Science in Computer Science',
    'education',
    'https://example.com/image.jpg',
    new Date('2023-01-01'),
    'University of Technology'
  );

  const mockCreateDto: CreateTimelineEventDTO = {
    year: '2023',
    title: 'Bachelor Degree',
    description: 'Completed Bachelor of Science in Computer Science',
    type: 'education',
    image: 'https://example.com/image.jpg',
    location: 'University of Technology'
  };

  const mockUpdateDto: UpdateTimelineEventDTO = {
    title: 'Updated Bachelor Degree',
    description: 'Updated description'
  };

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelineEventService,
        {
          provide: ITIMELINE_EVENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TimelineEventService>(TimelineEventService);
    repository = module.get(ITIMELINE_EVENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of timeline events', async () => {
      repository.findAll.mockResolvedValue([mockTimelineEvent]);

      const result = await service.list();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTimelineEvent.id);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a timeline event', async () => {
      repository.save.mockResolvedValue(mockTimelineEvent);

      const result = await service.create(mockCreateDto);

      expect(result.title).toBe(mockCreateDto.title);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a timeline event when found', async () => {
      repository.findById.mockResolvedValue(mockTimelineEvent);

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(result.id).toBe(mockTimelineEvent.id);
      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException when timeline event not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return timeline events of specific type', async () => {
      repository.findByType.mockResolvedValue([mockTimelineEvent]);

      const result = await service.findByType('education');

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('education');
      expect(repository.findByType).toHaveBeenCalledWith('education');
    });
  });

  describe('update', () => {
    it('should update and return a timeline event', async () => {
      const updatedTimelineEvent = new TimelineEvent(
        mockTimelineEvent.id,
        mockTimelineEvent.year,
        'Updated Bachelor Degree',
        'Updated description',
        mockTimelineEvent.type,
        mockTimelineEvent.image,
        mockTimelineEvent.createdAt,
        mockTimelineEvent.location
      );

      repository.findById.mockResolvedValue(mockTimelineEvent);
      repository.save.mockResolvedValue(updatedTimelineEvent);

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', mockUpdateDto);

      expect(result.title).toBe('Updated Bachelor Degree');
      expect(result.description).toBe('Updated description');
      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when timeline event not found for update', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent-id', mockUpdateDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a timeline event', async () => {
      repository.findById.mockResolvedValue(mockTimelineEvent);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(repository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException when timeline event not found for deletion', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });
});