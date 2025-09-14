import { Injectable, Inject } from '@nestjs/common';
import {
  type IProjectRepository,
  IPROJECT_REPOSITORY,
} from 'src/domain/project/project.repository';
import {
  CreateProjectDTO,
  MediaDTO,
  TechnoDTO,
} from 'src/presentation/project/project.dto';
import { fromCreateDTO, toDTO } from './project.mapper';
import { Media, MediaType } from 'src/domain/project/media.entity';
import { Techno } from 'src/domain/project/techno.entity';
import { IMEDIA_REPOSITORY, type IMediaRepository } from 'src/domain/project/media.repository';
import { ITECHNO_REPOSITORY, type ITechnoRepository } from 'src/domain/project/techno.repository';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(IPROJECT_REPOSITORY) private projectRepository: IProjectRepository,
    @Inject(IMEDIA_REPOSITORY) private mediaRepository: IMediaRepository,
    @Inject(ITECHNO_REPOSITORY) private technoRepository: ITechnoRepository,
  ) {}

  async list() {
    return this.projectRepository
      .findAll()
      .then((entities) => entities.map((entity) => toDTO(entity)));
  }

  async create(new_project: CreateProjectDTO) {
    return this.createWithMediaIds(new_project);
  }

  /**
   * Create a project with media IDs (2-step workflow)
   * Media should be uploaded first using MediaService, then referenced by ID here
   */
  async createWithMediaIds(projectData: CreateProjectDTO) {
    try {
      // 1. Validate and fetch media entities if IDs are provided
      const mediaEntities: Media[] = [];
      
      if (projectData.media && projectData.media.length > 0) {
        for (const mediaId of projectData.media) {
          // Fetch existing media by ID
          const existingMedia = await this.mediaRepository.findById(mediaId);
          if (!existingMedia) {
            throw new Error(`Media with ID ${mediaId} not found`);
          }
          mediaEntities.push(existingMedia);
        }
      }

      // 2. Handle technologies (existing logic)
      const technoEntities: Techno[] = [];
      
      if (projectData.techStack && projectData.techStack.length > 0) {
        for (const techDto of projectData.techStack) {
          let existingTechno = await this.technoRepository.findByName(techDto.technology);

          if (existingTechno) {
            technoEntities.push(existingTechno);
          } else {
            const newTechno = new Techno(
              crypto.randomUUID(),
              techDto.technology,
              techDto.iconUrl
            );
            const savedTechno = await this.technoRepository.save(newTechno);
            technoEntities.push(savedTechno);
          }
        }
      }

      // 3. Create project entity
      let domain_entity = fromCreateDTO(projectData);
      domain_entity.id = crypto.randomUUID();
      
      // Set technologies and media
      domain_entity.techStack = technoEntities;
      domain_entity.media = mediaEntities;
      
      // 4. Save project
      domain_entity = await this.projectRepository.save(domain_entity);
      
      return toDTO(domain_entity);

    } catch (error) {
      throw error;
    }
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
    
    // Créer une entité Media complète avec des valeurs par défaut pour les champs manquants
    const vo = new Media(
      mediaId, 
      MediaType[media.type], 
      media.url, 
      media.originalName || 'legacy-file',
      media.fileName || media.originalName || 'legacy-file',
      media.mimeType || 'application/octet-stream',
      media.size || 0,
      media.uploadedAt ? new Date(media.uploadedAt) : new Date(),
      media.alt,
      media.uploadedBy
    );
    
    entity.addMedia(vo);
    const saved = await this.projectRepository.save(entity);
    return toDTO(saved);
  }

  /**
   * Add existing media to project by media ID (2-step workflow)
   */
  async addMediaById(projectId: string, mediaId: string) {
    const entity = await this.projectRepository.findById(projectId);
    if (!entity) {
      throw new Error('Project not found');
    }

    // Check if media exists
    const existingMedia = await this.mediaRepository.findById(mediaId);
    if (!existingMedia) {
      throw new Error(`Media with ID ${mediaId} not found`);
    }

    // Check if media is already associated with this project
    const isAlreadyAssociated = entity.media.some(m => m.id === mediaId);
    if (isAlreadyAssociated) {
      throw new Error('Media is already associated with this project');
    }

    entity.addMedia(existingMedia);
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

  async addTechnology(projectId: string, techno: TechnoDTO) {
    const entity = await this.projectRepository.findById(projectId);
    if (!entity) {
      throw new Error('Project not found');
    }
    const technoEntity = new Techno(techno.id, techno.technology, techno.iconUrl);
    entity.addTechStack(technoEntity);
    const saved = await this.projectRepository.save(entity);
    return toDTO(saved);
  }

  async removeTechnology(projectId: string, technoId: string) {
    const entity = await this.projectRepository.findById(projectId);
    if (!entity) {
      throw new Error('Project not found');
    }
    const techno = entity.techStack.find((t) => t.id === technoId);
    if (!techno) {
      throw new Error('Technology not found');
    }
    entity.removeTechStack(techno);
    const saved = await this.projectRepository.save(entity);
    return toDTO(saved);
  }
}
