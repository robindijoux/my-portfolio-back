import { Media } from './media.entity';
import { Techno } from './techno.entity';

export class Project {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  views: number;
  isPublished: boolean;
  featured: boolean;
  repositoryLink?: string;
  projectLink?: string;
  media: Media[];
  techStack: Techno[];
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    shortDescription: string,
    description: string,
    views: number,
    isPublished: boolean,
    createdAt: Date,
    featured: boolean,
    repositoryLink?: string,
    projectLink?: string,
    media?: Media[],
    techStack?: Techno[],
  ) {
    this.id = id;
    this.name = name;
    this.shortDescription = shortDescription;
    this.description = description;
    this.views = views;
    this.isPublished = isPublished;
    this.repositoryLink = repositoryLink;
    this.projectLink = projectLink;
    this.media = media ? [...media] : [];
    this.techStack = techStack ? [...techStack] : [];
    this.createdAt = createdAt;
    this.featured = featured;
  }

  addMedia(m: Media): void {
    if (!this.media.some((x) => x.equals(m))) {
      this.media.push(m);
    }
  }

  removeMedia(m: Media): void {
    this.media = this.media.filter((x) => !x.equals(m));
  }

  clearMedia(): void {
    this.media = [];
  }

  addTechStack(tech: Techno): void {
    if (!this.techStack.some((x) => x.id === tech.id)) {
      this.techStack.push(tech);
    }
  }

  removeTechStack(tech: Techno): void {
    this.techStack = this.techStack.filter((x) => x.id !== tech.id);
  }

  clearTechStack(): void {
    this.techStack = [];
  }
}
