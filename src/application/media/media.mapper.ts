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
    dto.originalName || '',
    dto.fileName || '',
    dto.mimeType || '',
    dto.size || 0,
    dto.uploadedAt ? new Date(dto.uploadedAt) : new Date(),
    dto.alt,
    dto.uploadedBy,
  );
}

export function toDTO(entity: Media): MediaDTO {
  const dto = new MediaDTO();
  dto.id = entity.id;
  dto.type = MediaType[entity.type];
  dto.url = entity.url;
  dto.alt = entity.alt;
  dto.originalName = entity.originalName;
  dto.fileName = entity.fileName;
  dto.mimeType = entity.mimeType;
  dto.size = entity.size;
  dto.uploadedAt = entity.uploadedAt.toISOString();
  dto.uploadedBy = entity.uploadedBy;
  return dto;
}

export function toDB(entity: Media): MediaDB {
  const db = new MediaDB();
  db.id = entity.id;
  db.type = entity.type as 'PHOTO' | 'VIDEO' | 'PDF' | 'DOCUMENT';
  db.url = entity.url;
  db.alt = entity.alt;
  db.originalName = entity.originalName;
  db.fileName = entity.fileName;
  db.mimeType = entity.mimeType;
  db.size = entity.size;
  db.uploadedAt = entity.uploadedAt;
  db.uploadedBy = entity.uploadedBy;
  return db;
}

export function fromDB(db: MediaDB): Media {
  return new Media(
    db.id,
    MediaType[db.type],
    db.url,
    db.originalName,
    db.fileName,
    db.mimeType,
    db.size,
    db.uploadedAt,
    db.alt,
    db.uploadedBy,
  );
}
