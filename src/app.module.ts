import { Module } from '@nestjs/common';
import { ProjectModule } from './module/project/project.module';
import { TechnoModule } from './module/techno/techno.module';
import { MediaModule } from './module/media/media.module';
import { HealthModule } from './presentation/health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config/env';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProjectModule,
    TechnoModule,
    MediaModule,
    HealthModule,
    TypeOrmModule.forRoot({
      type: env.DATABASE.TYPE,
      host: env.DATABASE.HOST,
      port: env.DATABASE.PORT,
      username: env.DATABASE.USERNAME,
      password: env.DATABASE.PASSWORD,
      database: env.DATABASE.NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: env.DATABASE.SYNC,
      dropSchema: env.DATABASE.SYNC,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
