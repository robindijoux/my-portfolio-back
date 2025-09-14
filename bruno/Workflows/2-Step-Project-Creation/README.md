# Workflow 2-Step Project Creation

Ce dossier contient les tests pour le **workflow 2-étapes** de création de projets avec médias.

## 🎯 Principe

Le workflow sépare l'upload des médias de la création du projet pour plus de flexibilité :

1. **Étape 1** : Upload des médias → Récupération des IDs
2. **Étape 2** : Création du projet en référençant les IDs

## 📋 Tests disponibles

### 🔄 Workflow de base
1. **1. Upload Media** - Upload d'un fichier média sur S3
2. **2. Create Project with Media ID** - Création de projet avec 1 média

### 🔄 Workflow multi-média  
1. **1. Upload Media** - Premier média
2. **1b. Upload Second Media** - Second média
3. **3. Create Project with Multiple Media** - Projet avec 2 médias

### 🔧 Extension de projet
4. **4. Add Media to Existing Project** - Ajout de média à un projet existant

## ⚡ Exécution rapide

Pour tester le workflow complet :

```bash
# Workflow de base
1. Upload Media → 2. Create Project with Media ID

# Workflow multi-média
1. Upload Media → 1b. Upload Second Media → 3. Create Project with Multiple Media

# Extension
Après workflow de base → 4. Add Media to Existing Project
```

## 🗂️ Format des payloads

### Upload de média
```json
// POST /media/upload (multipart/form-data)
{
  "file": "fichier binaire",
  "alt": "Description du média",
  "folder": "projects"
}
```

### Création de projet
```json
// POST /projects (application/json)
{
  "name": "Nom du projet",
  "description": "Description détaillée",
  "shortDescription": "Description courte", 
  "isPublished": true,
  "featured": false,
  "media": ["id-media-1", "id-media-2"],
  "techStack": [...],
  "repositoryLink": "https://github.com/...",
  "projectLink": "https://example.com"
}
```

### Ajout de média à projet
```json
// POST /projects/{id}/media (application/json)
{
  "mediaId": "id-du-media-existant"
}
```

## ✅ Avantages

- **Performance** : Pas de re-upload de médias
- **Réutilisabilité** : Un média peut être utilisé dans plusieurs projets
- **Flexibilité** : Composition libre des médias
- **Granularité** : Gestion fine des associations
- **Évolutivité** : Ajout/retrait dynamique de médias

## 🎪 Variables d'environnement

Les tests utilisent ces variables Bruno :

- `uploaded_media_id_1` - ID du premier média uploadé
- `uploaded_media_id_2` - ID du second média uploadé
- `two_step_project_id` - ID du projet créé avec workflow 2-étapes
- `multi_media_project_id` - ID du projet multi-média

## 📝 Notes

- Les médias sont stockés sur **AWS S3**
- Les métadonnées sont en **base de données**
- Le workflow est **idempotent** et **robuste**
- Tous les tests incluent des **validations complètes**