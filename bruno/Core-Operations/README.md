# Core Operations

Tests pour les **opérations CRUD de base** de l'API Portfolio.

## 📁 Structure

```
Core-Operations/
├── Projects/           # Gestion des projets
├── Media/             # Gestion des médias  
└── Technologies/      # Gestion des technologies
```

## 🎯 Objectif

Ces tests couvrent les opérations fondamentales de chaque entité :

- **Create** - Création d'entités
- **Read** - Lecture/récupération 
- **Update** - Modification
- **Delete** - Suppression

## 🔄 Vs Workflows

**Core Operations** = Tests individuels par entité
**Workflows** = Tests de processus métier complets

### Utilisation recommandée

- **Développement** : Core Operations pour tests unitaires
- **Validation métier** : Workflows pour scénarios utilisateur
- **Debug** : Core Operations pour isoler les problèmes
- **Documentation** : Les deux selon le contexte

## 📝 Conventions

- Noms en anglais (convention API)
- Un test = une opération
- Tests indépendants et idempotents
- Documentation claire dans chaque test