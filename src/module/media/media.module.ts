import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from '../../presentation/media/media.controller';
import { MediaService } from '../../application/media/media.service';
import { MediaDB } from '../../infra/db/media-db/media-db.entity';
import { MediaDBRepository } from '../../infra/db/media-db/media-db.repository';
import { S3BucketRepository } from '../../infra/aws/s3/S3BucketRepository';
import { IMEDIA_REPOSITORY } from '../../domain/project/media.repository';
import { IFILE_REPOSITORY } from '../../application/shared/file/IFileRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaDB]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: IMEDIA_REPOSITORY,
      useClass: MediaDBRepository,
    },
    {
      provide: IFILE_REPOSITORY,
      useClass: S3BucketRepository,
    },
  ],
  exports: [MediaService, IMEDIA_REPOSITORY],
})
export class MediaModule {}