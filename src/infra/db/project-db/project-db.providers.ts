import { DataSource } from 'typeorm';
import { ProjectDB } from './project-db.entity';
import { PROJECT_REPOSITORY } from 'src/module/project/project.constants';

export const projectProviders = [
  {
    provide: PROJECT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProjectDB),
    inject: [],
  },
];
