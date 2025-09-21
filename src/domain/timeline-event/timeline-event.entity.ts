export type TimelineEventType = 'education' | 'achievement' | 'work';

export class TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  type: TimelineEventType;
  location?: string;
  image: string;
  createdAt: Date;

  constructor(
    id: string,
    year: string,
    title: string,
    description: string,
    type: TimelineEventType,
    image: string,
    createdAt: Date,
    location?: string,
  ) {
    this.id = id;
    this.year = year;
    this.title = title;
    this.description = description;
    this.type = type;
    this.location = location;
    this.image = image;
    this.createdAt = createdAt;
  }

  equals(other: TimelineEvent): boolean {
    return this.id === other.id;
  }
}