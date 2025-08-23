import { Project } from './project.entity';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  save(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
}

export const IPROJECT_REPOSITORY = 'ProjectRepository';
