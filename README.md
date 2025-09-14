# 🎯 Portfolio Backend API

Une API RESTful robuste pour la gestion d'un portfolio de développeur, construite avec NestJS et suivant les principes du Domain-Driven Design (DDD). Elle propose une gestion complète des projets, des capacités d'upload de médias et une intégration cloud.

## ✨ Fonctionnalités Principales

- **🏗️ Architecture DDD** : Séparation claire des responsabilités avec couches domain, application, infrastructure et présentation
- **📊 Gestion de Projets** : CRUD complet pour les projets portfolio avec métadonnées  
- **📁 Upload & Gestion de Médias** : Upload de fichiers avec validation, limitation de taille et génération de noms uniques
- **☁️ Intégration Cloud** : Support AWS S3 avec compatibilité MinIO
- **📚 Documentation Swagger** : Documentation API auto-générée
- **🗄️ Base de Données** : PostgreSQL avec TypeORM et relations entre entités
- **🐳 Support Docker** : Conteneurisation complète avec Docker Compose
- **🔒 Gestion d'Erreurs** : Validation et gestion d'exceptions complète
- **🌐 Support CORS** : Partage de ressources cross-origin
- **💪 TypeScript** : Implémentation complète avec vérification de types stricte

## 🏗️ Architecture DDD

Ce projet suit les principes du Domain-Driven Design avec une approche d'architecture propre :

```
src/
├── domain/                      # 🔵 Couche Domaine (Cœur Métier)
│   └── project/
│       ├── project.entity.ts    # Entité domaine avec logique métier
│       ├── project.repository.ts # Interface repository
│       └── media.vo.ts          # Objet de valeur Media
├── application/                 # 🟢 Couche Application
│   └── project/
│       ├── project.service.ts   # Workflows et cas d'usage métier
│       └── project.mapper.ts    # Mapping Domain ↔ DTO
├── infra/                       # 🟡 Couche Infrastructure
│   └── db/
│       ├── project-db/
│       │   ├── project-db.entity.ts     # Entité TypeORM
│       │   ├── project-db.repository.ts # Implémentation repository
│       │   └── project-db.providers.ts  # Injection de dépendance
│       └── media-db/
│           └── media-db.entity.ts       # Entité Media TypeORM
├── presentation/                # 🔴 Couche Présentation
│   └── project/
│       ├── project.controller.ts # Contrôleurs REST HTTP
│       └── project.dto.ts        # Objets de Transfert de Données
├── module/                      # 📦 Modules NestJS
│   └── project/
│       └── project.module.ts     # Conteneur d'injection de dépendance
└── config/                      # ⚙️ Configuration
    └── env.ts                   # Configuration d'environnement
```

### 🎯 Principes DDD Appliqués
- **Inversion de Dépendances** : Les couches application et domaine définissent les interfaces
- **Architecture Propre** : Les dépendances pointent vers le domaine
- **Isolation du Domaine** : Logique métier isolée des préoccupations techniques
- **Objets de Valeur** : Objets immutables comme `Media` avec validation métier
- **Pattern Repository** : Accès aux données abstrait avec interfaces propres

## 📋 Prérequis

- **Node.js** (v18 ou supérieur)
- **Docker & Docker Compose** (pour le déploiement conteneurisé)
- **PostgreSQL** (si exécution sans Docker)
- **Yarn** (gestionnaire de paquets)

## 🚀 Démarrage Rapide

### 🐳 Avec Docker (Recommandé)

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd portfolio/backend
   ```

2. **Démarrer l'application**
   ```bash
   docker-compose up -d
   ```

3. **Accéder à l'API**
   - API : http://localhost:3002/api
   - Documentation Swagger : http://localhost:3002/docs
   - Base de données : PostgreSQL sur localhost:5432

### ⚙️ Installation Manuelle

1. **Installer les dépendances**
   ```bash
   yarn install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec votre configuration
   ```

3. **Démarrer la base de données PostgreSQL**
   ```bash
   docker-compose up postgres -d
   ```

4. **Créer le répertoire uploads**
   ```bash
   mkdir -p uploads
   ```

5. **Lancer l'application**
   ```bash
   # Développement
   yarn start:dev
   
   # Production
   yarn build
   yarn start:prod
   ```

## 📚 Documentation API

Documentation automatiquement générée avec Swagger disponible à :
- **Développement Local** : http://localhost:3001/docs (installation manuelle)
- **Environnement Docker** : http://localhost:3002/docs
- **Production** : `<votre-domaine>/docs`

### 🔗 Endpoints Principaux

| Méthode | Endpoint | Description | Fonctionnalités |
|---------|----------|-------------|-----------------|
| GET | `/api/projects` | Récupérer tous les projets | Liste avec médias |
| GET | `/api/projects/:id` | Récupérer un projet par ID | Inclut URLs médias |
| POST | `/api/projects` | Créer un nouveau projet | Avec validation |
| DELETE | `/api/projects/:id` | Supprimer un projet | Suppression en cascade |
| POST | `/api/projects/:id/media` | **Upload fichier média** | **Upload avec métadonnées** |
| DELETE | `/api/projects/:id/media` | Supprimer un média | Suppression spécifique |

### 📁 Fonctionnalités d'Upload

L'endpoint `/api/projects/:id/media` supporte :
- **Types de Fichiers** : JPG, JPEG, PNG, GIF, WEBP
- **Taille de Fichier** : Maximum 5MB
- **Métadonnées** : Texte alternatif et type de média (PHOTO/VIDEO)
- **Nommage Unique** : Génération basée sur timestamp
- **Validation** : Validation complète type et taille de fichier
- **Diffusion Statique** : Fichiers accessibles via préfixe URL `/uploads/`

## 🗄️ Base de Données

PostgreSQL avec TypeORM comme ORM. Relations entre entités `ProjectDB` ↔ `MediaDB` (1:N).

### 📋 Schéma Principal
- **ProjectDB** : Informations projet (nom, description, liens, vues, dates)
- **MediaDB** : Fichiers médias liés (type, URL, alt, metadata)

## 🧪 Tests

```bash
yarn test              # Tests unitaires
yarn test:watch        # Mode watch
yarn test:cov          # Couverture
yarn test:e2e          # Tests E2E
```

## 🔧 Développement

```bash
yarn start:dev         # Serveur dev avec hot reload
yarn build             # Build production
yarn format            # Formatage Prettier
yarn lint              # Lint ESLint
```

## 🌍 Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port serveur | `3001` |
| `DB_HOST` | Host base de données | `localhost` |
| `DB_NAME` | Nom base de données | `portfolio` |
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:3000` |
| `S3_BUCKET` | Nom bucket S3 | `my-portfolio-media` |

> 📖 **Documentation Complète** : Voir [Variables d'Environnement](#) pour la liste complète

## 🐳 Docker

```bash
docker-compose up -d    # Démarrer tous les services
docker-compose logs -f  # Voir les logs
docker-compose down     # Arrêter
```

**Services** : API (port 3002) + PostgreSQL (port 5432)

## 📖 Documentation Avancée

- **[📁 Guide API Media](./MEDIA_API_GUIDE.md)** - Upload de fichiers et gestion des médias
- **[🛠️ Implémentation Techno](./TECHNO_IMPLEMENTATION.md)** - Système de technologies pour projets
- **[🧪 Collections Bruno](./bruno/)** - Tests API et exemples d'utilisation

## 🔗 Stack Technologique

**Core** : NestJS, TypeScript, Node.js  
**Base de Données** : PostgreSQL, TypeORM  
**Upload** : Multer, AWS S3  
**Documentation** : Swagger/OpenAPI  
**Tests** : Jest, Bruno API  
**DevOps** : Docker, ESLint, Prettier  

## 🤝 Contribution

1. Fork → Branch → Changes → Tests → PR
2. Suivre les principes DDD et la structure des couches
3. Utiliser les conventional commits

## 📝 Licence & Auteur

**Licence** : UNLICENSED  
**Auteur** : Robin Dijoux (dr@ecomail.fr)  
**Repository** : [my-portfolio-back](https://github.com/robindijoux/my-portfolio-back)

---

*Construit avec ❤️ using NestJS, TypeScript et les principes Domain-Driven Design.*

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
