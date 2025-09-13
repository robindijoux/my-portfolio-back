import { DataSource } from 'typeorm';
import { TechnoDB } from './techno-db.entity';
import { ITECHNO_REPOSITORY } from 'src/domain/project/techno.repository';

export const technoProviders = [
  {
    provide: ITECHNO_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TechnoDB),
    inject: [],
  },
];
