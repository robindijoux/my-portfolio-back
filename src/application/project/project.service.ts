import { Injectable, Inject } from '@nestjs/common';
import {
  type IProjectRepository,
  IPROJECT_REPOSITORY,
} from 'src/domain/project/project.repository';
import {
  CreateProjectDTO,
  type MediaDTO,
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
    // 1. Gérer les technologies (créer ou récupérer existantes)
    const technoEntities: Techno[] = [];
    
    if (new_project.techStack && new_project.techStack.length > 0) {
      for (const techDto of new_project.techStack) {
        // Rechercher si la technologie existe déjà (par nom, insensible à la casse)
        let existingTechno = await this.technoRepository.findByName(techDto.technology);

        if (existingTechno) {
          // Utiliser la technologie existante
          technoEntities.push(existingTechno);
        } else {
          // Créer une nouvelle technologie
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

    // 2. Créer l'entité projet avec les technologies résolues
    let domain_entity = fromCreateDTO(new_project);
    domain_entity.id = crypto.randomUUID();
    
    // Remplacer le techStack par les entités résolues
    domain_entity.techStack = technoEntities;
    
    // 3. Sauvegarder le projet
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
