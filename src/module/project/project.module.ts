import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from 'src/application/project/project.service';
import { IPROJECT_REPOSITORY } from 'src/domain/project/project.repository';
import { ProjectDB } from 'src/infra/db/project-db/project-db.entity';
import { ProjectDBRepository } from 'src/infra/db/project-db/project-db.repository';
import { ProjectController } from 'src/presentation/project/project.controller';
import { MediaDB } from 'src/infra/db/media-db/media-db.entity';
import { IMEDIA_REPOSITORY } from 'src/domain/project/media.repository';
import { MediaDBRepository } from 'src/infra/db/media-db/media-db.repository';

@Module({
  providers: [
    ProjectService,
    {
      provide: IPROJECT_REPOSITORY,
      useClass: ProjectDBRepository,
    },
    {
      provide: IMEDIA_REPOSITORY,
      useClass: MediaDBRepository,
    }
  ],
  exports: [],
  imports: [TypeOrmModule.forFeature([ProjectDB, MediaDB])],
  controllers: [ProjectController],
})
export class ProjectModule {}
