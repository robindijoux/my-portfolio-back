import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from 'src/application/project/project.service';
import { IPROJECT_REPOSITORY } from 'src/domain/project/project.repository';
import { ProjectDB } from 'src/infra/db/project-db/project-db.entity';
import { ProjectDBRepository } from 'src/infra/db/project-db/project-db.repository';
import { ProjectController } from 'src/presentation/project/project.controller';
import { MediaDB } from 'src/infra/db/media-db/media-db.entity';
import { TechnoDB } from 'src/infra/db/techno-db/techno-db.entity';
import { IMEDIA_REPOSITORY } from 'src/domain/project/media.repository';
import { ITECHNO_REPOSITORY } from 'src/domain/project/techno.repository';
import { MediaDBRepository } from 'src/infra/db/media-db/media-db.repository';
import { TechnoDBRepository } from 'src/infra/db/techno-db/techno-db.repository';

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
    },
    {
      provide: ITECHNO_REPOSITORY,
      useClass: TechnoDBRepository,
    }
  ],
  exports: [],
  imports: [TypeOrmModule.forFeature([ProjectDB, MediaDB, TechnoDB])],
  controllers: [ProjectController],
})
export class ProjectModule {}
