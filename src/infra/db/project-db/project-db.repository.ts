import { Project } from 'src/domain/project/project.entity';
import { IProjectRepository } from 'src/domain/project/project.repository';
import { ProjectDB } from './project-db.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fromDB, toDB } from 'src/application/project/project.mapper';

export class ProjectDBRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectDB)
    private projectRepository: Repository<ProjectDB>,
  ) {}

  async findAll(): Promise<Project[]> {
    const rows = await this.projectRepository.find();
    return rows.map(fromDB);
  }
  async findById(id: string): Promise<Project | null> {
    const row = await this.projectRepository.findOne({ where: { id } });
    return row ? fromDB(row) : null;
  }
  async save(project: Project): Promise<Project> {
    const projectDB = this.projectRepository.create(toDB(project));
    const saved = await this.projectRepository.save(projectDB);
    return fromDB(saved);
  }
  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
