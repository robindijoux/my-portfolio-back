import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMediaRepository } from 'src/domain/project/media.repository';
import { MediaDB } from './media-db.entity';
import { Media } from 'src/domain/project/media.entity';
import { fromDB, toDB } from 'src/application/media/media.mapper';

@Injectable()
export class MediaDBRepository implements IMediaRepository {
  constructor(
    @InjectRepository(MediaDB)
    private mediaRepository: Repository<MediaDB>,
  ) {}

  async findAll(): Promise<Media[]> {
    const rows = await this.mediaRepository.find();
    return rows.map(fromDB);
  }

  async findById(id: string): Promise<Media | null> {
    const row = await this.mediaRepository.findOne({ where: { id } });
    return row ? fromDB(row) : null;
  }

  async findByProjectId(projectId: string): Promise<Media[]> {
    const rows = await this.mediaRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
    return rows.map(fromDB);
  }

  async save(media: Media): Promise<Media> {
    const mediaDB = this.mediaRepository.create(toDB(media));
    const saved = await this.mediaRepository.save(mediaDB);
    return fromDB(saved);
  }

  async delete(id: string): Promise<void> {
    await this.mediaRepository.delete(id);
  }
}
