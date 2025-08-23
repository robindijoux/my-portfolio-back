import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectDB } from '../project-db/project-db.entity';

@Entity()
export class MediaDB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 16 })
  type: 'PHOTO' | 'VIDEO';

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt?: string;

  @ManyToOne(() => ProjectDB, (project) => project.media, {
    onDelete: 'CASCADE',
  })
  project: ProjectDB;
}
