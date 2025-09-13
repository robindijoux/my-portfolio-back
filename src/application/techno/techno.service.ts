import { Injectable, Inject } from '@nestjs/common';
import {
  type ITechnoRepository,
  ITECHNO_REPOSITORY,
} from 'src/domain/project/techno.repository';
import { TechnoDTO, CreateTechnoDTO } from 'src/presentation/project/project.dto';
import { fromDTO, toDTO } from './techno.mapper';

@Injectable()
export class TechnoService {
  constructor(
    @Inject(ITECHNO_REPOSITORY) private technoRepository: ITechnoRepository,
  ) {}

  async list() {
    return this.technoRepository
      .findAll()
      .then((entities) => entities.map((entity) => toDTO(entity)));
  }

  async create(newTechno: CreateTechnoDTO) {
    // Créer un TechnoDTO avec un ID généré
    const technoWithId: TechnoDTO = {
      id: crypto.randomUUID(),
      technology: newTechno.technology,
      iconUrl: newTechno.iconUrl,
    };
    
    let domainEntity = fromDTO(technoWithId);
    domainEntity = await this.technoRepository.save(domainEntity);
    return toDTO(domainEntity);
  }

  async delete(id: string) {
    return this.technoRepository.delete(id);
  }

  async get(id: string) {
    const entity = await this.technoRepository.findById(id);
    if (!entity) {
      throw new Error('Technology not found');
    }
    return toDTO(entity);
  }
}
