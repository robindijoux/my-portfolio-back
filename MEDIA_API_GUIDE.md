# 📁 API Media - Guide d'Implémentation

> Guide complet pour l'upload de fichiers (photos, vidéos, PDF) vers un bucket S3 avec stockage des métadonnées en base de données.

## 🎯 Vue d'Ensemble

L'API Media permet de :
- ✅ **Upload de fichiers** vers AWS S3 ou MinIO
- ✅ **Validation automatique** des types et tailles
- ✅ **Métadonnées enrichies** stockées en base PostgreSQL
- ✅ **URLs signées** pour accès sécurisé
- ✅ **Statistiques** d'utilisation des médias

## 🔧 Configuration Requise Media - Guide d'Implémentation

Cette documentation explique comment utiliser l'API Media qui permet l'upload de fichiers (photos, vidéos, PDF) vers un bucket S3 avec stockage des métadonnées en base de données.

## 🔧 Configuration Requise

### 🔑 Variables d'Environnement

```env
# Configuration AWS S3
AWS_REGION=eu-west-3
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Optionnel - Pour MinIO ou S3 compatible
S3_ENDPOINT=http://localhost:9000
S3_FORCE_PATH_STYLE=true
```

### 📂 Types de Fichiers Supportés

| Type | Extensions | MIME Types | Icône |
|------|------------|------------|-------|
| **🖼️ Images** | `.jpg, .jpeg, .png, .gif, .webp` | `image/jpeg, image/png, image/gif, image/webp` | 🖼️ |
| **🎥 Vidéos** | `.mp4, .mov, .mpeg, .webm` | `video/mp4, video/quicktime, video/mpeg, video/webm` | 🎥 |
| **📄 Documents** | `.pdf, .doc, .docx, .txt` | `application/pdf, application/msword, text/plain` | 📄 |

### ⚠️ Limitations
- **Taille maximale** : 50MB par fichier
- **Organisation automatique** : Les fichiers sont organisés par type dans des dossiers S3
- **Nommage unique** : Génération automatique pour éviter les conflits

## 🚀 Guide d'Utilisation

### 📤 1. Upload d'un Média
```http
POST /media/upload
Content-Type: multipart/form-data
```

**Paramètres form-data :**
- `file` *(requis)* : Le fichier à uploader
- `alt` *(optionnel)* : Texte alternatif pour l'accessibilité
- `folder` *(optionnel)* : Dossier personnalisé dans le bucket

**Réponse (201 Created) :**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "PHOTO",
  "url": "https://bucket.s3.region.amazonaws.com/photos/timestamp-filename.jpg",
  "alt": "Description de l'image",
  "originalName": "mon-image.jpg",
  "fileName": "1672531200000-random-uuid.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "uploadedAt": "2025-01-01T12:00:00.000Z"
}
```

### 📋 2. Lister les Médias
```http
GET /media
GET /media?projectId=uuid  # Filtrer par projet
```

### 🔍 3. Récupérer un Média
```http
GET /media/:id
```

### 🗑️ 4. Supprimer un Média
```http
DELETE /media/:id
```
> ⚠️ **Attention** : Supprime le fichier S3 ET l'entrée en base de données

### ✏️ 5. Mettre à Jour les Métadonnées
```http
PUT /media/:id/metadata
Content-Type: application/json

{
  "alt": "Nouvelle description"
}
```

### 🔐 6. Générer une URL Signée
```http
GET /media/:id/signed-url?expiresIn=3600
```

**Réponse :**
```json
{
  "signedUrl": "https://bucket.s3.amazonaws.com/file.jpg?X-Amz-Signature=...",
  "expiresAt": "2025-01-01T13:00:00.000Z"
}
```

### 📊 7. Statistiques des Médias
```http
GET /media/stats/overview
```

**Réponse :**
```json
{
  "totalCount": 42,
  "totalSize": 10485760,
  "totalSizeFormatted": "10.0 MB",
  "byType": {
    "PHOTO": 30,
    "VIDEO": 10,
    "PDF": 2
  }
}
```

## 🏗️ Architecture DDD

```
� Media Module Architecture
├── 🔵 Domain/
│   ├── media.entity.ts          # Entité métier avec validation
│   └── media.repository.ts      # Interface repository
├── 🟢 Application/
│   ├── media.service.ts         # Logique métier upload/gestion
│   └── file.repository.ts       # Interface stockage fichiers
├── 🟡 Infrastructure/
│   ├── s3-bucket.repository.ts  # Implémentation AWS S3
│   ├── media-db.repository.ts   # Persistance PostgreSQL
│   └── media-db.entity.ts       # Entité TypeORM
└── 🔴 Presentation/
    ├── media.controller.ts      # Endpoints REST
    └── media.dto.ts             # Objets de transfert
```

### 🎯 Principes Respectés
- **🔄 Inversion de dépendances** : Domain définit, Infrastructure implémente
- **🧩 Séparation des responsabilités** : Chaque couche a un rôle précis
- **🛡️ Validation métier** : Règles dans l'entité Domain
- **🔀 Mapping propre** : DTOs ↔ Entities via mappers

## 🧪 Tests et Exemples

### 📬 Avec Bruno/Postman

**1. Upload de fichier :**
```
POST http://localhost:3000/media/upload
Headers: Content-Type: multipart/form-data
Body: 
- file: [Sélectionner fichier]
- alt: "Description de mon image"
```

**2. Test des autres endpoints :**
- Copier l'`id` retourné par l'upload
- Remplacer `{{mediaId}}` dans les requêtes suivantes

### 📋 Collection Bruno Disponible
```
bruno/Core-Operations/Media/
├── Upload Media.bru
├── Get All Media.bru  
├── Get Media by ID.bru
├── Update Media Metadata.bru
├── Generate Signed URL.bru
├── Get Media Stats.bru
└── Delete Media.bru
```

## ⚠️ Gestion d'Erreurs

| Code | Description | Solution |
|------|-------------|----------|
| **400** | Fichier non supporté/trop volumineux | Vérifier type et taille |
| **404** | Média non trouvé | Vérifier l'ID du média |
| **413** | Fichier trop volumineux | Réduire la taille (< 50MB) |
| **500** | Erreur S3 ou base de données | Vérifier configuration AWS |

## 🔐 Sécurité

### ✅ Mesures Implémentées
- **Validation MIME stricte** : Vérification type de contenu
- **Correspondance extension/MIME** : Double validation
- **Limite de taille configurable** : Protection contre abus
- **URLs signées** : Accès temporaire sécurisé
- **Noms de fichiers uniques** : Prévention des conflits
- **Validation métadonnées** : Sanitisation des entrées

### 🛡️ Recommandations
- Utiliser HTTPS en production
- Configurer CORS approprié
- Limiter les taux de requêtes
- Scanner les fichiers uploads (antivirus)

## 🗄️ Migration Base de Données

### 📊 Nouvelle Structure MediaDB

```typescript
interface MediaDB {
  id: string;                    // UUID
  type: 'PHOTO'|'VIDEO'|'PDF'|'DOCUMENT';
  url: string;                   // URL S3 complète
  alt?: string;                  // Texte alternatif
  originalName: string;          // Nom original
  fileName: string;              // Nom généré
  mimeType: string;              // Type MIME
  size: number;                  // Taille en bytes
  uploadedAt: Date;              // Date d'upload
  uploadedBy?: string;           // ID utilisateur (optionnel)
}
```

### 🔄 Script de Migration

```sql
-- Ajouter nouvelles colonnes si nécessaire
ALTER TABLE media_db 
ADD COLUMN IF NOT EXISTS original_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS size INTEGER,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(255);

-- Ajouter support types PDF et DOCUMENT
ALTER TABLE media_db 
ALTER COLUMN type TYPE VARCHAR(20);
```

---

> 💡 **Conseil** : Testez l'API en local avec MinIO avant de déployer sur AWS S3 en production.