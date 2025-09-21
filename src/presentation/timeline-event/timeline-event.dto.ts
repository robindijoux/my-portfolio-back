import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelineEventDTO {
  @ApiProperty({ 
    description: 'Year of the timeline event',
    example: '2023'
  })
  year: string;

  @ApiProperty({ 
    description: 'Title of the timeline event',
    example: 'Bachelor Degree in Computer Science'
  })
  title: string;

  @ApiProperty({ 
    description: 'Description of the timeline event',
    example: 'Completed Bachelor of Science in Computer Science with honors'
  })
  description: string;

  @ApiProperty({ 
    description: 'Type of timeline event',
    enum: ['education', 'achievement', 'work'],
    example: 'education'
  })
  type: 'education' | 'achievement' | 'work';

  @ApiProperty({ 
    description: 'Location of the event (optional)',
    required: false,
    example: 'University of Technology'
  })
  location?: string;

  @ApiProperty({ 
    description: 'Image URL for the timeline event',
    example: 'https://example.com/image.jpg'
  })
  image: string;
}

export class UpdateTimelineEventDTO {
  @ApiProperty({ 
    description: 'Year of the timeline event',
    required: false,
    example: '2023'
  })
  year?: string;

  @ApiProperty({ 
    description: 'Title of the timeline event',
    required: false,
    example: 'Bachelor Degree in Computer Science'
  })
  title?: string;

  @ApiProperty({ 
    description: 'Description of the timeline event',
    required: false,
    example: 'Completed Bachelor of Science in Computer Science with honors'
  })
  description?: string;

  @ApiProperty({ 
    description: 'Type of timeline event',
    enum: ['education', 'achievement', 'work'],
    required: false,
    example: 'education'
  })
  type?: 'education' | 'achievement' | 'work';

  @ApiProperty({ 
    description: 'Location of the event (optional)',
    required: false,
    example: 'University of Technology'
  })
  location?: string;

  @ApiProperty({ 
    description: 'Image URL for the timeline event',
    required: false,
    example: 'https://example.com/image.jpg'
  })
  image?: string;
}

export class TimelineEventDTO {
  @ApiProperty({ 
    description: 'Unique timeline event identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({ 
    description: 'Year of the timeline event',
    example: '2023'
  })
  year: string;

  @ApiProperty({ 
    description: 'Title of the timeline event',
    example: 'Bachelor Degree in Computer Science'
  })
  title: string;

  @ApiProperty({ 
    description: 'Description of the timeline event',
    example: 'Completed Bachelor of Science in Computer Science with honors'
  })
  description: string;

  @ApiProperty({ 
    description: 'Type of timeline event',
    enum: ['education', 'achievement', 'work'],
    example: 'education'
  })
  type: 'education' | 'achievement' | 'work';

  @ApiProperty({ 
    description: 'Location of the event (optional)',
    required: false,
    example: 'University of Technology'
  })
  location?: string;

  @ApiProperty({ 
    description: 'Image URL for the timeline event',
    example: 'https://example.com/image.jpg'
  })
  image: string;

  @ApiProperty({ 
    description: 'Timeline event creation date',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  constructor(
    id: string,
    year: string,
    title: string,
    description: string,
    type: 'education' | 'achievement' | 'work',
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
}