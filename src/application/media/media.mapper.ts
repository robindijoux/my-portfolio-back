import {
  MediaDTO,
} from 'src/presentation/project/project.dto';
import { MediaDB } from 'src/infra/db/media-db/media-db.entity';
import { Media, MediaType } from 'src/domain/project/media.entity';

export function fromDTO(dto: MediaDTO): Media {
  return new Media(
    dto.id,
    MediaType[dto.type],
    dto.url,
    dto.alt,
  );
}

export function toDTO(entity: Media): MediaDTO {
  const dto = new MediaDTO();
  dto.id = entity.id;
  dto.type = MediaType[entity.type];
  dto.url = entity.url;
  dto.alt = entity.alt;
  return dto;
}

export function toDB(entity: Media): MediaDB {
  const db = new MediaDB();
  db.id = entity.id;
  db.type = entity.type as 'PHOTO' | 'VIDEO';
  db.url = entity.url;
  db.alt = entity.alt;
  return db;
}

export function fromDB(db: MediaDB): Media {
  return new Media(
    db.id,
    MediaType[db.type],
    db.url,
    db.alt,
  );
}
