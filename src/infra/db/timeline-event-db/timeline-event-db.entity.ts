import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('timeline_events')
export class TimelineEventDB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 4 })
  year: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['education', 'achievement', 'work'],
  })
  type: 'education' | 'achievement' | 'work';

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ length: 500 })
  image: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}