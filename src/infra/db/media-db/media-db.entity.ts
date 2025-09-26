import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { ProjectDB } from '../project-db/project-db.entity';

@Entity()
export class MediaDB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 16 })
  type: 'PHOTO' | 'VIDEO' | 'PDF' | 'DOCUMENT';

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt?: string;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uploadedBy?: string;

  @ManyToOne(() => ProjectDB, (project) => project.media, {
    onDelete: 'CASCADE',
  })
  project: ProjectDB;
}
