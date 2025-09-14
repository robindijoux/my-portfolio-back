# Core Operations - Projects

Tests pour les opérations CRUD de base sur les **projets**.

## 📋 Tests disponibles

### 🔧 Gestion des projets
- **Create Project** - Création de projet basique (sans médias)
- **Create Project with TechStack** - Création avec technologies
- **List Projects** - Récupération de tous les projets
- **Get Project** - Récupération d'un projet par ID
- **Delete Project** - Suppression d'un projet

### 🔗 Associations projet-média
- **Remove Media** - Retirer un média d'un projet

### 🔗 Associations projet-technologie  
- **Add Technology to Project** - Ajouter une technologie à un projet
- **Remove Technology from Project** - Retirer une technologie d'un projet

## 🎯 Usage

Ces tests servent pour :
- **Développement** : Valider les opérations de base
- **Tests unitaires** : Vérifier le comportement des endpoints
- **Documentation** : Exemples d'utilisation de l'API
- **Debugging** : Isoler les problèmes par opération

## 📝 Note

Pour la **création de projets avec médias**, utilisez plutôt le workflow 2-étapes dans `Workflows/2-Step-Project-Creation/`.

Ces tests sont axés sur les opérations pures sans complexité de médias.