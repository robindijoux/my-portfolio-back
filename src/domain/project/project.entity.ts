import { Media } from './media.entity';

export class Project {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  views: number;
  isPublished: boolean;
  repositoryLink?: string;
  projectLink?: string;
  media: Media[];

  constructor(
    id: string,
    name: string,
    shortDescription: string,
    description: string,
    views: number,
    isPublished: boolean,
    repositoryLink?: string,
    projectLink?: string,
    media?: Media[],
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
}
