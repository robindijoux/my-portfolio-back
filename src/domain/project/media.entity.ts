export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export class Media {
  id: string;
  type: MediaType;
  url: string;
  alt?: string;

  constructor(id: string, type: MediaType, url: string, alt?: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('Media id is required');
    }
    if (!url || url.trim().length === 0) {
      throw new Error('Media url is required');
    }
    this.id = id;
    this.type = type;
    this.url = url;
    this.alt = alt;
    Object.freeze(this); // shallow immutability
  }

  equals(other: Media): boolean {
    if (!other) return false;
    return (
      this.id === other.id &&
      this.type === other.type &&
      this.url === other.url &&
      this.alt === other.alt
    );
  }
}
