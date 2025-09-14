import { Media } from './media.entity';

export interface IMediaRepository {
  findAll(): Promise<Media[]>;
  findById(id: string): Promise<Media | null>;
  findByProjectId(projectId: string): Promise<Media[]>;
  save(media: Media): Promise<Media>;
  delete(id: string): Promise<void>;
}

export const IMEDIA_REPOSITORY = 'MediaRepository';
