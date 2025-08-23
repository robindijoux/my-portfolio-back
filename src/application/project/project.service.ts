import { Injectable, Inject } from '@nestjs/common';
import {
  type IProjectRepository,
  IPROJECT_REPOSITORY,
} from 'src/domain/project/project.repository';
import {
  CreateProjectDTO,
  type MediaDTO,
} from 'src/presentation/project/project.dto';
import { fromCreateDTO, toDTO } from './project.mapper';
import { Media, MediaType } from 'src/domain/project/media.entity';
import { IMEDIA_REPOSITORY, type IMediaRepository } from 'src/domain/project/media.repository';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(IPROJECT_REPOSITORY) private projectRepository: IProjectRepository,
    @Inject(IMEDIA_REPOSITORY) private mediaRepository: IMediaRepository,
  ) {}

  async list() {
    return this.projectRepository
      .findAll()
      .then((entities) => entities.map((entity) => toDTO(entity)));
  }

  async create(new_project: CreateProjectDTO) {
    let domain_entity = fromCreateDTO(new_project);
    domain_entity.id = crypto.randomUUID();
    domain_entity = await this.projectRepository.save(domain_entity);
    return toDTO(domain_entity);
  }

  async delete(id: string) {
    return this.projectRepository.delete(id);
  }

  async get(id: string) {
    const entity = await this.projectRepository.findById(id);
    if (!entity) {
      throw new Error('Project not found');
    }
    return toDTO(entity);
  }

  async addMedia(projectId: string, media: MediaDTO) {
    const entity = await this.projectRepository.findById(projectId);
    if (!entity) {
      throw new Error('Project not found');
    }
    const mediaId = media.id || crypto.randomUUID(); // Generate ID if not provided
    const vo = new Media(mediaId, MediaType[media.type], media.url, media.alt);
    entity.addMedia(vo);
    const saved = await this.projectRepository.save(entity);
    return toDTO(saved);
  }

  async removeMedia(projectId: string, mediaId: string) {
    const entity = await this.projectRepository.findById(projectId);
    if (!entity) {
      throw new Error('Project not found');
    }
    const media = entity.media.find((m) => m.id === mediaId);
    if (!media) {
      throw new Error('Media not found');
    }
    entity.removeMedia(media);
    const saved = await this.projectRepository.save(entity);
    await this.mediaRepository.delete(mediaId);
    return toDTO(saved);
  }
}
