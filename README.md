# 🎯 Portfolio Backend API

Une API RESTful robuste pour la gestion d'un portfolio de développeur, construite avec NestJS et suivant les principes du Domain-Driven Design (DDD). Elle propose une gestion complète des projets, des capacités d'upload de médias sécurisées et une intégration cloud AWS.

## ✨ Fonctionnalités Principales

- **🏗️ Architecture DDD** : Séparation claire des responsabilités avec couches domain, application, infrastructure et présentation
- **� Authentification JWT** : Sécurisation avec AWS Cognito et vérification JWT automatique
- **�📊 Gestion de Projets** : CRUD complet pour les projets portfolio avec métadonnées et technologies
- **📁 Upload & Gestion de Médias** : Upload sécurisé vers AWS S3 avec validation, limitation de taille et métadonnées
- **👥 Gestion des Technologies** : Système complet de gestion des technologies avec icônes
- **☁️ Intégration Cloud** : Support AWS S3 pour stockage de médias avec URLs pré-signées
- **📚 Documentation Swagger** : Documentation API auto-générée avec authentification Bearer
- **🗄️ Base de Données** : PostgreSQL avec TypeORM et relations complexes entre entités
- **🐳 Support Docker** : Conteneurisation complète avec Docker Compose et hot-reload
- **🔒 Sécurité** : Validation et gestion d'exceptions complète avec guards JWT
- **🌐 Support CORS** : Partage de ressources cross-origin configuré
- **💪 TypeScript** : Implémentation complète avec vérification de types stricte
- **🧪 Tests Complets** : Collections Bruno API avec workflows authentifiés

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
   git clone https://github.com/robindijoux/my-portfolio-back.git
   cd my-portfolio-back
   ```

2. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations AWS (S3 + Cognito)
   ```

3. **Démarrer l'application**
   ```bash
   docker-compose up --build -d
   ```

4. **Accéder aux services**
   - 🚀 **API** : http://localhost:3002/api
   - 📚 **Documentation Swagger** : http://localhost:3002/docs
   - 🗄️ **PostgreSQL** : localhost:5432 (portfolio_user/portfolio_password)

### ⚙️ Installation Manuelle

1. **Installer les dépendances**
   ```bash
   yarn install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Configurer : DB, AWS S3, AWS Cognito
   ```

3. **Démarrer PostgreSQL**
   ```bash
   docker-compose up postgres -d
   ```

4. **Lancer l'application**
   ```bash
   # Développement avec hot-reload
   yarn start:dev
   
   # Production
   yarn build
   yarn start:prod
   ```

### 🔧 Configuration AWS Requise

**AWS S3 (Stockage médias) :**
```bash
AWS_REGION=eu-west-3
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**AWS Cognito (Authentification) :**
```bash
AWS_COGNITO_USER_POOL_ID=eu-west-3_xxxxxxxxx
AWS_COGNITO_CLIENT_ID=your-client-id
```

## 📚 Documentation API

Documentation automatiquement générée avec Swagger + authentification Bearer :

### 🌐 Accès Documentation
- **🔧 Développement Local** : http://localhost:3002/docs
- **🐳 Environnement Docker** : http://localhost:3002/docs  
- **🚀 Production** : `<votre-domaine>/docs`

### 🔐 Test avec Authentification

**Via Swagger UI :**
1. Cliquer sur 🔒 **"Authorize"** en haut à droite
2. Entrer : `Bearer your-jwt-token-here`
3. Tester les endpoints protégés directement

**Obtenir un Token JWT :**
- Via AWS Cognito Console
- Via SDK Cognito dans votre frontend
- Via collections Bruno (workflow d'authentification)

### 📋 Fonctionnalités Documentation

- **🔓 Endpoints publics** : Testables directement
- **🔒 Endpoints protégés** : Badge "Bearer Auth" visible
- **📝 Schémas complets** : DTOs, entités, réponses d'erreur
- **🧪 Try it out** : Interface de test intégrée avec auth
- **📊 Code examples** : curl, JavaScript, Python auto-générés

### 🔗 Endpoints Principaux

| Méthode | Endpoint | Description | Auth | Fonctionnalités |
|---------|----------|-------------|------|-----------------|
| **Projects** | | | | |
| GET | `/api/projects` | Récupérer tous les projets | ❌ | Liste avec médias et technologies |
| GET | `/api/projects/:id` | Récupérer un projet par ID | ❌ | Inclut URLs médias et tech stack |
| POST | `/api/projects` | Créer un nouveau projet | ✅ | Avec validation et médias |
| DELETE | `/api/projects/:id` | Supprimer un projet | ✅ | Suppression en cascade |
| **Media Management** | | | | |
| POST | `/api/media/upload` | **Upload fichier média** | ✅ | **Upload S3 avec métadonnées** |
| GET | `/api/media` | Lister tous les médias | ❌ | Avec pagination et filtres |
| DELETE | `/api/media/:id` | Supprimer un média | ✅ | Suppression S3 + DB |
| PUT | `/api/media/:id/metadata` | Modifier métadonnées | ✅ | Alt text, type, etc. |
| **Project-Media Relations** | | | | |
| POST | `/api/projects/:id/media` | Associer média à projet | ✅ | Lien média existant |
| DELETE | `/api/projects/:id/media/:mediaId` | Dissocier média | ✅ | Suppression relation |
| **Technologies** | | | | |
| GET | `/api/technologies` | Lister technologies | ❌ | Avec icônes |
| POST | `/api/technologies` | Créer technologie | ✅ | Nom + URL icône |
| DELETE | `/api/technologies/:id` | Supprimer technologie | ✅ | Avec validation usage |
| **Project-Technology Relations** | | | | |
| POST | `/api/projects/:id/techno` | Ajouter technologie | ✅ | Association projet-tech |
| DELETE | `/api/projects/:id/techno/:technoId` | Retirer technologie | ✅ | Suppression relation |

**🔐 Légende Auth :**
- ✅ **Authentification requise** : JWT Bearer token AWS Cognito
- ❌ **Public** : Accès libre (lecture seule)

### 📁 Fonctionnalités d'Upload

L'endpoint `/api/media/upload` supporte :
- **🔐 Authentification** : JWT Bearer token AWS Cognito requis
- **Types de Fichiers** : 
  - Images : JPG, JPEG, PNG, GIF, WEBP
  - Vidéos : MP4, MPEG, MOV, WEBM
  - Documents : PDF, DOC, DOCX, TXT
- **Taille de Fichier** : Maximum 50MB
- **Stockage** : AWS S3 avec URLs pré-signées
- **Métadonnées** : Texte alternatif, type de média, dossier personnalisé
- **Validation** : Validation complète type MIME et taille de fichier
- **Sécurité** : Upload direct vers S3 avec permissions IAM
- **Organisation** : Gestion par dossiers et tags

**Workflow Recommandé :**
1. **Upload Média** : `POST /api/media/upload` (authentifié)
2. **Créer Projet** : `POST /api/projects` avec IDs des médias (authentifié)
3. **Associer/Dissocier** : APIs de relation projet-média (authentifié)

## 🗄️ Base de Données

PostgreSQL avec TypeORM comme ORM. Relations complexes entre entités :

### 📋 Schéma Principal
- **ProjectDB** : Informations projet (nom, description, liens, vues, dates)
- **MediaDB** : Fichiers médias (type, URL S3, métadonnées, dossiers)
- **TechnoDB** : Technologies (nom, URL icône, métadonnées)

### 🔗 Relations
- **Project ↔ Media** : Relation Many-to-Many avec table de jonction
- **Project ↔ Technology** : Relation Many-to-Many pour tech stack
- **Media** : Entité autonome (peut exister sans projet)

### 🔄 Migrations
```bash
# Auto-sync activé en développement (DB_SYNC=true)
# En production : migrations TypeORM manuelles
yarn typeorm migration:generate -n MigrationName
yarn typeorm migration:run
```

## 🔐 Authentification & Sécurité

### AWS Cognito Integration

L'API utilise **AWS Cognito** pour l'authentification avec vérification JWT automatique :

- **User Pool** : Gestion des utilisateurs AWS Cognito
- **JWT Tokens** : Tokens d'accès avec validation automatique
- **Bearer Auth** : Authentification via header `Authorization: Bearer <token>`
- **Guards** : Protection automatique des routes sensibles
- **Performance** : Cache JWKS intégré pour des performances optimales

### 🔒 Routes Protégées

**Authentification Requise (JWT Bearer) :**
- 🔴 **Toutes les opérations de création/modification** : POST, PUT, DELETE
- 🔴 **Upload de médias** : `/api/media/upload`
- 🔴 **Gestion de projets** : création, suppression, associations
- 🔴 **Gestion des technologies** : CRUD complet

**Accès Public (GET) :**
- 🟢 **Consultation** : `/api/projects`, `/api/projects/:id`
- 🟢 **Listing** : `/api/technologies`, `/api/media`
- 🟢 **Health Check** : `/api/health`

### 🛡️ Configuration Sécurité

```typescript
// Configuration JWT automatique
JWT_VERIFIER_CONFIG = {
  userPoolId: 'eu-west-3_xxxxxxxxx',
  clientId: 'your-client-id',
  tokenUse: 'access',
  region: 'eu-west-3'
}
```

### 📝 Utilisation dans Bruno/Postman

```bash
# Headers pour routes protégées
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

# Les collections Bruno incluent la gestion auto des tokens
# Voir : bruno/environments/Local.bru
```

## 🔧 Développement

```bash
yarn start:dev         # Serveur dev avec hot reload
yarn build             # Build production
yarn format            # Formatage Prettier
yarn lint              # Lint ESLint
```

## 🌍 Variables d'Environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| **Application** | | | |
| `NODE_ENV` | Mode d'environnement | `development` | ❌ |
| `PORT` | Port serveur | `3002` | ❌ |
| **Base de Données** | | | |
| `DB_HOST` | Host base de données | `postgres` | ❌ |
| `DB_PORT` | Port base de données | `5432` | ❌ |
| `DB_USERNAME` | Nom d'utilisateur DB | `portfolio_user` | ❌ |
| `DB_PASSWORD` | Mot de passe DB | `portfolio_password` | ❌ |
| `DB_NAME` | Nom base de données | `portfolio` | ❌ |
| `DB_SYNC` | Auto-sync schéma | `true` (dev) | ❌ |
| **CORS** | | | |
| `FRONTEND_URL` | URL frontend (CORS) | `*` | ❌ |
| **AWS S3 (Stockage)** | | | |
| `AWS_REGION` | Région AWS | `eu-west-3` | ✅ |
| `AWS_S3_BUCKET_NAME` | Nom bucket S3 | - | ✅ |
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS | - | ✅ |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS | - | ✅ |
| **AWS Cognito (Authentification)** | | | |
| `AWS_COGNITO_USER_POOL_ID` | ID User Pool Cognito | - | ✅ |
| `AWS_COGNITO_CLIENT_ID` | ID Client Cognito | - | ✅ |

### � Configuration Recommandée

**Développement :**
```bash
# Base de données locale via Docker
DB_HOST=localhost
DB_SYNC=true

# S3 pour médias (bucket de dev)
AWS_S3_BUCKET_NAME=portfolio-dev-bucket

# Cognito pour auth (pool de dev)
AWS_COGNITO_USER_POOL_ID=eu-west-3_xxxxxxxxx
```

**Production :**
```bash
# Base de données managed
DB_HOST=your-rds-endpoint
DB_SYNC=false

# S3 production avec CDN
AWS_S3_BUCKET_NAME=portfolio-prod-bucket

# Cognito production
AWS_COGNITO_USER_POOL_ID=eu-west-3_yyyyyyyyy
```

## 🐳 Docker

```bash
docker-compose up -d    # Démarrer tous les services
docker-compose logs -f  # Voir les logs
docker-compose down     # Arrêter
```

**Services** : 
- 🚀 **API Backend** : port 3002 (avec hot-reload dev)
- 🗄️ **PostgreSQL** : port 5432 (avec health checks)
- 📦 **Volumes** : postgres_data, yarn_deps (persistence)

## 📖 Documentation Avancée

- **[📁 Guide API Media](./MEDIA_API_GUIDE.md)** - Upload S3, gestion métadonnées et workflow médias
- **[🛠️ Implémentation Techno](./TECHNO_IMPLEMENTATION.md)** - Système de technologies et associations projets
- **[🧪 Collections Bruno](./bruno/README.md)** - Tests API authentifiés et workflows complets
- **[🏗️ Architecture DDD](./docs/architecture-ddd.puml)** - Diagramme architecture et couches
- **[⚙️ Configuration Docker](./docker-compose.yaml)** - Setup multi-services avec hot-reload

### 🔗 Liens Externes

- **[NestJS Documentation](https://docs.nestjs.com/)** - Framework et patterns
- **[AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-examples.html)** - Configuration S3
- **[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/)** - Setup authentification
- **[TypeORM](https://typeorm.io/)** - ORM et migrations
- **[Bruno API](https://www.usebruno.com/)** - Client API pour tests

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

## 🧪 Tests & Validation

### Tests Unitaires
```bash
yarn test              # Tests unitaires Jest
yarn test:watch        # Mode watch
yarn test:cov          # Couverture de code
yarn test:e2e          # Tests E2E
yarn test:debug        # Mode debug
```

### Tests API avec Bruno

Le projet inclut des collections Bruno complètes :

```
bruno/
├── Core-Operations/          # Tests CRUD de base
│   ├── Projects/            # Gestion projets
│   ├── Media/              # Upload & gestion médias
│   └── Technologies/       # Gestion technologies
├── Workflows/              # Workflows métier
│   └── 2-Step-Project-Creation/  # Processus création complète
└── environments/           # Configuration (Local, Prod)
    ├── Local.bru          # Variables locales + JWT
    └── Prod.bru           # Configuration production
```

**🔐 Tests Authentifiés :**
- Configuration `jwt_token` automatique dans environnements
- Tests adaptatifs : 200 (succès) ou 401 (auth requise)
- Workflows complets avec gestion des tokens

**🚀 Utilisation :**
1. Installer Bruno API Client
2. Ouvrir collection depuis `bruno/`
3. Configurer `jwt_token` dans environnement Local
4. Exécuter tests individuels ou workflows complets

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

## 🔗 Stack Technologique

### Core Framework
- **NestJS** `^11.0.1` : Progressive Node.js framework avec TypeScript et DDD
- **TypeScript** `^5.7.3` : Type-safe JavaScript avec ES features avancées
- **Node.js** : JavaScript runtime (v18+)

### Base de Données & ORM
- **PostgreSQL** `15-alpine` : Base de données relationnelle performante
- **TypeORM** `^0.3.25` : Object-Relational Mapping avec relations complexes

### Authentification & Sécurité
- **AWS Cognito** : Service d'authentification managed AWS
- **aws-jwt-verify** `^5.1.0` : Validation JWT optimisée avec cache JWKS
- **Passport** `^0.7.0` + Guards : Stratégies d'authentification NestJS

### Cloud & Storage
- **AWS SDK S3** `^3.744.0` : Client S3 pour upload/gestion de médias
- **S3 Request Presigner** `^3.888.0` : URLs pré-signées sécurisées
- **Multer** : Middleware upload de fichiers (via @nestjs/platform-express)

### API Documentation
- **Swagger/OpenAPI** `^11.2.0` : Documentation auto-générée avec auth Bearer
- **Bruno** : Collections API complètes avec tests authentifiés

### Development Tools
- **ESLint** `^9.18.0` : Linting avec TypeScript strict et Prettier
- **Jest** `^30.0.0` : Framework de tests avec couverture de code
- **Docker** : Containerisation avec hot-reload et multi-services

### Architecture Patterns
- **Domain-Driven Design (DDD)** : Architecture propre avec séparation des couches
- **Repository Pattern** : Abstraction d'accès aux données avec interfaces
- **Dependency Injection** : Container IoC NestJS avec modules
- **JWT Strategy** : Authentification stateless avec AWS Cognito

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

## 🤝 Contribution

### 🚀 Workflow de Contribution

1. **Fork** → **Branch** → **Changes** → **Tests** → **PR**
2. **Suivre les principes DDD** et la structure des couches
3. **Utiliser les conventional commits** : `feat:`, `fix:`, `docs:`
4. **Tester avec authentification** via collections Bruno

### 📋 Guidelines de Développement

**Architecture :**
- Respecter la séparation des couches DDD
- Utiliser les interfaces repository pour l'accès aux données
- Implémenter les Guards JWT pour les nouvelles routes protégées

**Sécurité :**
- Toutes les routes de modification doivent être protégées (`@UseGuards(JwtAuthGuard)`)
- Valider les permissions utilisateur si nécessaire
- Utiliser `@CurrentUser()` pour accéder aux données utilisateur

**Tests :**
- Ajouter des tests unitaires pour les nouveaux services
- Mettre à jour les collections Bruno pour les nouveaux endpoints
- Vérifier les cas d'authentification (200 + 401)

### 🔧 Setup Développeur

```bash
# Installation développement
git clone https://github.com/robindijoux/my-portfolio-back.git
cd my-portfolio-back
yarn install

# Configuration environnement local
cp .env.example .env
# Configurer AWS S3 + Cognito

# Démarrage avec hot-reload
docker-compose up --build -d

# Tests et qualité
yarn test
yarn lint
yarn format
```

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
