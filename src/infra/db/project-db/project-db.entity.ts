import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MediaDB } from '../media-db/media-db.entity';
import { TechnoDB } from '../techno-db/techno-db.entity';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('int', { default: 0 })
  views: number;

  @OneToMany(() => MediaDB, (media) => media.project, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  media: MediaDB[];

  @Column('boolean', { default: false })
  featured: boolean;

  @ManyToMany(() => TechnoDB, (techno) => techno.projects, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'project_techno',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'techno_id', referencedColumnName: 'id' },
  })
  techStack: TechnoDB[];
}
