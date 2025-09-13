import {
  TechnoDTO,
} from 'src/presentation/project/project.dto';
import { TechnoDB } from 'src/infra/db/techno-db/techno-db.entity';
import { Techno } from 'src/domain/project/techno.entity';

export function fromDTO(dto: TechnoDTO): Techno {
  return new Techno(
    dto.id,
    dto.technology,
    dto.iconUrl,
  );
}

export function toDTO(entity: Techno): TechnoDTO {
  const dto = new TechnoDTO();
  dto.id = entity.id;
  dto.technology = entity.technology;
  dto.iconUrl = entity.iconUrl;
  return dto;
}

export function toDB(entity: Techno): TechnoDB {
  const db = new TechnoDB();
  db.id = entity.id;
  db.technology = entity.technology;
  db.iconUrl = entity.iconUrl;
  return db;
}

export function fromDB(db: TechnoDB): Techno {
  return new Techno(
    db.id,
    db.technology,
    db.iconUrl,
  );
}
