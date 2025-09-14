# Workflows

Tests pour les **processus métier complets** de l'API Portfolio.

## 📁 Structure

```
Workflows/
└── 2-Step-Project-Creation/    # Workflow de création projet avec médias
```

## 🎯 Objectif

Les workflows testent des **scénarios utilisateur complets** qui impliquent plusieurs entités et étapes séquentielles.

## 🔄 Workflow disponible

### 2-Step Project Creation
Processus en 2 étapes pour créer des projets avec médias :

1. **Upload de médias** → Récupération des IDs
2. **Création de projet** → Référence aux médias par ID

**Avantages** :
- Réutilisabilité des médias
- Performance (pas de re-upload)
- Flexibilité de composition
- Gestion granulaire

## 🆚 Core Operations

| Aspect | Core Operations | Workflows |
|--------|----------------|-----------|
| **Scope** | Une entité | Processus complet |
| **Tests** | Opération unique | Scénario métier |
| **Usage** | Debug/Développement | Validation E2E |
| **Dépendances** | Aucune | Séquentielles |

## 📝 Ajout de workflows

Pour ajouter un nouveau workflow :

1. Créer un dossier `Nouveau-Workflow/`
2. Numéroter les étapes (1., 2., 3...)
3. Ajouter un README explicatif
4. Inclure variables d'environnement
5. Documenter les prérequis et séquençage

## 🎪 Variables

Les workflows utilisent des **variables Bruno partagées** pour passer les données entre les étapes. Consultez chaque workflow pour connaître ses variables spécifiques.