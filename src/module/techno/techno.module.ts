import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnoService } from 'src/application/techno/techno.service';
import { ITECHNO_REPOSITORY } from 'src/domain/project/techno.repository';
import { TechnoDB } from 'src/infra/db/techno-db/techno-db.entity';
import { TechnoDBRepository } from 'src/infra/db/techno-db/techno-db.repository';
import { TechnoController } from 'src/presentation/techno/techno.controller';

@Module({
  providers: [
    TechnoService,
    {
      provide: ITECHNO_REPOSITORY,
      useClass: TechnoDBRepository,
    },
  ],
  exports: [TechnoService, ITECHNO_REPOSITORY],
  imports: [TypeOrmModule.forFeature([TechnoDB])],
  controllers: [TechnoController],
})
export class TechnoModule {}
