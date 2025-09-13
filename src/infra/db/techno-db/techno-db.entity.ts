import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProjectDB } from '../project-db/project-db.entity';

@Entity()
export class TechnoDB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  technology: string;

  @Column({ type: 'text' })
  iconUrl: string;

  @ManyToMany(() => ProjectDB, (project) => project.techStack)
  projects: ProjectDB[];
}
