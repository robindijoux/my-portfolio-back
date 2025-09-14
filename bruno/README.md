# Portfolio Backend API - Bruno Tests

Collection de tests API pour l'application **Portfolio Backend** utilisant Bruno.

## 🏗️ Structure organisée

```
bruno/
├── 🔄 Workflows/                    # Processus métier complets
│   └── 2-Step-Project-Creation/     # Création projet avec médias
├── ⚙️ Core-Operations/              # Opérations CRUD de base
│   ├── Projects/                    # Gestion des projets
│   ├── Media/                       # Gestion des médias
│   └── Technologies/                # Gestion des technologies
├── 🌍 environments/                 # Configuration d'environnements
└── 📋 Health.bru                    # Test de santé de l'API
```

## 🎯 Utilisation recommandée

### 🔄 Pour les workflows métier
**Utilisez `Workflows/`** pour :
- Validation des scénarios utilisateur complets
- Tests end-to-end
- Démonstration de l'API
- Onboarding nouveaux développeurs

### ⚙️ Pour les tests unitaires
**Utilisez `Core-Operations/`** pour :
- Tests d'opérations individuelles
- Debug et développement
- Validation des endpoints isolés
- Tests de régression ciblés

## 📋 Démarrage rapide

### 1. Test de base
```bash
Health.bru  # Vérifier que l'API répond
```

### 2. Workflow complet
```bash
Workflows/2-Step-Project-Creation/
├── 1. Upload Media
├── 2. Create Project with Media ID
└── (optionnel) 3. Create Project with Multiple Media
```

### 3. Opérations individuelles
```bash
Core-Operations/Projects/Create Project  # Projet basique
Core-Operations/Media/Upload Media       # Upload fichier
Core-Operations/Technologies/List Technologies  # Catalogue
```

## 🌍 Environnements

- **Local** (`Local.bru`) : `http://localhost:3000`
- **Prod** (`Prod.bru`) : Configuration de production

## 🔑 Variables d'environnement clés

| Variable | Description | Usage |
|----------|-------------|-------|
| `base_url` | URL de base de l'API | Tous les tests |
| `uploaded_media_id_1` | ID du premier média uploadé | Workflows |
| `uploaded_media_id_2` | ID du second média uploadé | Multi-média |
| `two_step_project_id` | ID du projet workflow 2-étapes | Extensions |

## 📚 Documentation

Chaque dossier contient sa propre documentation :
- `Workflows/README.md` - Guide des processus métier
- `Core-Operations/README.md` - Guide des opérations CRUD
- `Workflows/2-Step-Project-Creation/README.md` - Workflow détaillé

## 🚀 Nouveautés v2

### ✅ Workflow 2-étapes
- Upload de médias séparé de la création de projet
- Réutilisabilité des médias entre projets
- Performance améliorée
- Flexibilité maximale

### ✅ Organisation claire
- Séparation workflows vs opérations
- Nommage cohérent
- Documentation intégrée
- Structure scalable

### ❌ Supprimé (obsolète)
- Ancien workflow unifié
- Tests d'upload inline
- Structure en vrac

## 💡 Tips

- **Ordre d'exécution** : Respectez les numéros dans les workflows
- **Variables** : Vérifiez que les prérequis sont remplis
- **Échecs** : Consultez les logs et la documentation
- **Développement** : Utilisez Core-Operations pour tests isolés