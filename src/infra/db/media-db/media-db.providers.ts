import { DataSource } from 'typeorm';
import { MediaDB } from './media-db.entity';
import { IMEDIA_REPOSITORY } from 'src/domain/project/media.repository';

export const mediaProviders = [
  {
    provide: IMEDIA_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MediaDB),
    inject: [],
  },
];
