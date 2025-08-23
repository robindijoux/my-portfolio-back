import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MediaDB } from '../media-db/media-db.entity';

@Entity()
export class ProjectDB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 255 })
  shortDescription: string;

  @Column({ nullable: true })
  repositoryLink?: string;

  @Column({ nullable: true })
  projectLink?: string;

  @Column({ nullable: true })
  isPublished: boolean;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column('int', { default: 0 })
  views: number;

  @OneToMany(() => MediaDB, (media) => media.project, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  media: MediaDB[];
}
