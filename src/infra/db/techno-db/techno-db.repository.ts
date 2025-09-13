import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITechnoRepository } from 'src/domain/project/techno.repository';
import { TechnoDB } from './techno-db.entity';
import { Techno } from 'src/domain/project/techno.entity';
import { fromDB, toDB } from 'src/application/techno/techno.mapper';

export class TechnoDBRepository implements ITechnoRepository {
  constructor(
    @InjectRepository(TechnoDB)
    private technoRepository: Repository<TechnoDB>,
  ) {}

  async findAll(): Promise<Techno[]> {
    const rows = await this.technoRepository.find();
    return rows.map(fromDB);
  }
  
  async findById(id: string): Promise<Techno | null> {
    const row = await this.technoRepository.findOne({ where: { id } });
    return row ? fromDB(row) : null;
  }
  
  async findByName(technology: string): Promise<Techno | null> {
    const row = await this.technoRepository.findOne({ 
      where: { technology: technology } 
    });
    return row ? fromDB(row) : null;
  }
  
  async save(techno: Techno): Promise<Techno> {
    const technoDB = this.technoRepository.create(toDB(techno));
    const saved = await this.technoRepository.save(technoDB);
    return fromDB(saved);
  }
  
  async delete(id: string): Promise<void> {
    await this.technoRepository.delete(id);
  }
}
