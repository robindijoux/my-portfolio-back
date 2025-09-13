import { Techno } from './techno.entity';

export interface ITechnoRepository {
  findAll(): Promise<Techno[]>;
  findById(id: string): Promise<Techno | null>;
  findByName(technology: string): Promise<Techno | null>;
  save(techno: Techno): Promise<Techno>;
  delete(id: string): Promise<void>;
}

export const ITECHNO_REPOSITORY = 'TechnoRepository';
