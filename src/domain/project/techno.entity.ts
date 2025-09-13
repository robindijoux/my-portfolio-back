export class Techno {
  id: string;
  technology: string;
  iconUrl: string;

  constructor(id: string, technology: string, iconUrl: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('Techno id is required');
    }
    if (!technology || technology.trim().length === 0) {
      throw new Error('Technology name is required');
    }
    if (!iconUrl || iconUrl.trim().length === 0) {
      throw new Error('Technology icon URL is required');
    }
    
    this.id = id;
    this.technology = technology;
    this.iconUrl = iconUrl;
    Object.freeze(this); // shallow immutability
  }

  equals(other: Techno): boolean {
    if (!other) return false;
    return (
      this.id === other.id &&
      this.technology === other.technology &&
      this.iconUrl === other.iconUrl
    );
  }
}
