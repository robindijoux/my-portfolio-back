# Portfolio Backend API

A robust RESTful API for managing a developer's portfolio built with NestJS, following Domain-Driven Design (DDD) principles. Features comprehensive project management, media upload capabilities, and cloud storage integration.

## 🚀 Features

- **Domain-Driven Design Architecture**: Clean separation of concerns with domain, application, infrastructure, and presentation layers
- **Project Management**: Full CRUD operations for portfolio projects with metadata
- **Media Upload & Management**: 
  - File upload support with validation (JPG, JPEG, PNG, GIF, WEBP)
  - File size limits (5MB max)
  - Unique filename generation to prevent conflicts
  - Static file serving with proper URL mapping
- **Cloud Storage Integration**: AWS S3 support with configurable endpoints (including MinIO compatibility)
- **RESTful API**: Well-structured endpoints following REST conventions
- **Swagger Documentation**: Auto-generated API documentation with file upload support
- **Database Integration**: PostgreSQL with TypeORM and entity relationships
- **Docker Support**: Complete containerization with Docker Compose
- **Error Handling**: Comprehensive exception handling and validation
- **CORS Support**: Cross-origin resource sharing enabled
- **Type Safety**: Full TypeScript implementation with strict type checking

## 🏗️ Architecture

This project follows Domain-Driven Design (DDD) principles with a clean architecture approach:

```
src/
├── application/                 # Application Layer
│   └── project/
│       ├── project.service.ts   # Business workflows and use cases
│       └── project.mapper.ts    # Domain ↔ DTO mapping
├── domain/                      # Domain Layer (Business Core)
│   └── project/
│       ├── project.entity.ts    # Domain entity with business logic
│       ├── project.repository.ts # Repository interface
│       └── media.vo.ts          # Media value object
├── infra/                       # Infrastructure Layer
│   └── db/
│       ├── project-db/
│       │   ├── project-db.entity.ts     # TypeORM entity
│       │   ├── project-db.repository.ts # Repository implementation
│       │   └── project-db.providers.ts  # Dependency injection
│       └── media-db/
│           └── media-db.entity.ts       # Media TypeORM entity
├── presentation/                # Presentation Layer
│   └── project/
│       ├── project.controller.ts # HTTP REST controllers
│       └── project.dto.ts        # Data Transfer Objects
├── module/                      # NestJS Modules
│   └── project/
│       └── project.module.ts     # Dependency injection container
├── config/                      # Configuration
│   └── env.ts                   # Environment configuration
└── types/                       # Type definitions (if needed)
```

### Key DDD Principles Applied:
- **Dependency Inversion**: Application and domain layers define interfaces, infrastructure implements them
- **Clean Architecture**: Dependencies point inward toward the domain
- **Domain Isolation**: Business logic is isolated from technical concerns
- **Value Objects**: Immutable objects like `Media` with business validation
- **Repository Pattern**: Abstract data access with clean interfaces

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker & Docker Compose** (for containerized deployment)
- **PostgreSQL** (if running without Docker)
- **Yarn** (package manager)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio/backend
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the API**
   - API: http://localhost:3002/api
   - Swagger Documentation: http://localhost:3002/docs
   - Database: PostgreSQL on localhost:5432

### Manual Setup

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL database**
   ```bash
   docker-compose up postgres -d
   ```

4. **Create uploads directory**
   ```bash
   mkdir -p uploads
   ```

5. **Run the application**
   ```bash
   # Development
   yarn start:dev
   
   # Production
   yarn build
   yarn start:prod
   ```

## 📚 API Documentation

The API documentation is automatically generated using Swagger and available at:
- **Local Development**: http://localhost:3001/docs (manual setup)
- **Docker Environment**: http://localhost:3002/docs
- **Production**: `<your-domain>/docs`

### Main Endpoints

| Method | Endpoint | Description | Features |
|--------|----------|-------------|----------|
| GET | `/api/projects` | Get all projects | List with media |
| GET | `/api/projects/:id` | Get project by ID | Include media URLs |
| POST | `/api/projects` | Create new project | With validation |
| DELETE | `/api/projects/:id` | Delete project | Cascade delete media |
| POST | `/api/projects/:id/media` | Upload media file | **File upload with metadata** |
| DELETE | `/api/projects/:id/media` | Remove media | Remove specific media |

### File Upload Features

The `/api/projects/:id/media` endpoint supports:
- **File Types**: JPG, JPEG, PNG, GIF, WEBP
- **File Size**: Maximum 5MB
- **Metadata**: Alternative text and media type (PHOTO/VIDEO)
- **Unique Naming**: Timestamp-based filename generation
- **Validation**: Comprehensive file type and size validation
- **Static Serving**: Uploaded files accessible via `/uploads/` URL prefix

## 🗄️ Database

The application uses PostgreSQL as the primary database with TypeORM as the ORM.

### Database Schema

- **ProjectDB**: Main entity storing project information
  - `id`, `name`, `description`, `shortDescription`
  - `repositoryLink`, `projectLink`, `isPublished`
  - `views`, `createdAt`, `updatedAt`
- **MediaDB**: Related entity for project media files
  - `id`, `type` (PHOTO/VIDEO), `url`, `alt`
  - Foreign key relationship to `ProjectDB`

### Entity Relationships

```typescript
ProjectDB (1) ——— (N) MediaDB
```

- One-to-many relationship with cascade operations
- Orphan deletion for media without projects
- Eager loading of media in project queries

## 🧪 Testing

```bash
# Unit tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:cov

# E2E tests
yarn test:e2e

# Debug tests
yarn test:debug
```

## 🔧 Development

### Available Scripts

```bash
yarn start:dev        # Start development server with hot reload
yarn start:debug      # Start with debug mode
yarn build             # Build for production
yarn start:prod       # Start production server
yarn format           # Format code with Prettier
yarn lint              # Lint and fix code with ESLint
```

### Development Tools

- **Hot Reload**: Automatic restart on file changes
- **TypeScript**: Strict type checking with latest ES features
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Jest**: Testing framework with coverage reports

### Project Structure Conventions

- **Domain Layer**: Pure business logic, entities, and value objects
- **Application Layer**: Use cases, services, and business workflows
- **Infrastructure Layer**: Database, file system, and external service implementations
- **Presentation Layer**: Controllers, DTOs, and HTTP-specific concerns
- **Module Layer**: NestJS dependency injection containers

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3001` | No |
| **Database** | | | |
| `DB_HOST` | Database host | `localhost` | No |
| `DB_PORT` | Database port | `5432` | No |
| `DB_USERNAME` | Database username | `portfolio_user` | No |
| `DB_PASSWORD` | Database password | `portfolio_password` | No |
| `DB_NAME` | Database name | `portfolio` | No |
| `DB_SYNC` | Auto-sync database schema | `false` | No |
| **CORS** | | | |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | No |
| **Storage (AWS S3)** | | | |
| `STORAGE_PROVIDER` | Storage provider | `s3` | No |
| `S3_REGION` | AWS S3 region | `eu-west-1` | No |
| `S3_BUCKET` | S3 bucket name | `my-portfolio-media` | No |
| `S3_ENDPOINT` | Custom S3 endpoint (MinIO) | - | No |
| `S3_FORCE_PATH_STYLE` | Force path-style URLs | `false` | No |
| `S3_PUBLIC_BASE_URL` | CDN/public base URL | - | No |

## 🐳 Docker

The project includes a complete Docker setup with multi-service architecture:

### Services

- **PostgreSQL** (`portfolio_postgres`): Database service with health checks
- **API** (`portfolio_api`): NestJS application with hot reload in development

### Docker Configuration

```yaml
# Development ports
API: localhost:3002
Database: localhost:5432

# Volumes
- postgres_data: Persistent database storage
- yarn_deps: Node modules cache
- ./src:/app/src: Hot reload for development
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api
docker-compose logs -f postgres

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Access containers
docker exec -it portfolio_api sh
docker exec -it portfolio_postgres psql -U portfolio_user -d portfolio
```

## 📁 API Testing

The project includes Bruno API collections for comprehensive testing:

```
bruno/
├── bruno.json                   # Collection configuration
├── environments/
│   └── Local.bru               # Local environment variables
└── Project/
    ├── folder.bru              # Collection metadata
    ├── Create project.bru      # POST /projects
    ├── Get project.bru         # GET /projects/:id
    └── List projects.bru       # GET /projects
```

### Testing Workflow

1. **Install Bruno** (API client)
2. **Open collection** from `bruno/` directory
3. **Select environment** (Local)
4. **Run tests** in sequence or individually

### Environment Variables

- `base_url`: http://localhost:3001/api
- `project_id`: Auto-set from create response

## 🔧 File Upload Implementation

### Technical Details

```typescript
// File validation
- MIME type checking: /\/(jpg|jpeg|png|gif|webp)$/
- File size limit: 5MB (5 * 1024 * 1024 bytes)
- Required field validation

// Storage strategy
- Unique filename generation: timestamp + original name
- Directory auto-creation: uploads/ folder
- Static file serving: /uploads/ prefix
- Error handling: BadRequestException for failures
```

### Upload Flow

1. **File Validation**: Type and size checks via Multer
2. **Directory Creation**: Ensure uploads/ exists
3. **Unique Naming**: Timestamp-based naming
4. **File Writing**: Buffer to disk with fs/promises
5. **URL Generation**: Public URL for frontend access
6. **Database Storage**: Save metadata to MediaDB

## 🔗 Technology Stack

### Core Framework
- **NestJS**: Progressive Node.js framework with TypeScript
- **TypeScript**: Type-safe JavaScript with latest ES features
- **Node.js**: JavaScript runtime (v18+)

### Database & ORM
- **PostgreSQL**: Relational database
- **TypeORM**: Object-Relational Mapping with entity relationships

### File Handling
- **Multer**: File upload middleware (via @nestjs/platform-express)
- **fs/promises**: Native file system operations

### Cloud & Storage
- **AWS SDK**: S3 client and storage management
- **Static Assets**: Express static file serving

### API Documentation
- **Swagger/OpenAPI**: Auto-generated documentation
- **Bruno**: API testing and collection management

### Development Tools
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Jest**: Testing framework with coverage
- **Docker**: Containerization and development environment

### Architecture Patterns
- **Domain-Driven Design (DDD)**: Clean architecture principles
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: NestJS IoC container
- **Value Objects**: Immutable domain objects

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following the project structure
4. **Run tests and linting**
   ```bash
   yarn test
   yarn lint
   yarn format
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow DDD principles and layer separation
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure TypeScript strict mode compliance

## 📝 License

This project is licensed under the **UNLICENSED** license.

## 👨‍💻 Author

**Robin Dijoux**
- Email: dr@ecomail.fr
- Repository: [my-portfolio-back](https://github.com/robindijoux/my-portfolio-back)

## 📞 Support

For support, please:
1. **Check the documentation** and Swagger API docs
2. **Search existing issues** in the repository
3. **Open a new issue** with detailed information
4. **Contact the development team** via email

---

*Built with ❤️ using NestJS, TypeScript, and Domain-Driven Design principles.*
