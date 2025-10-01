# Terraform — Portfolio Backend (Azure Container Apps)

Ce dossier contient la configuration Terraform utilisée pour déployer l'API "portfolio-backend" sur Azure Container Apps. Le déploiement créé un Resource Group, un Log Analytics Workspace, un Container Apps Environment et une Container App.

Cette documentation a été mise à jour pour refléter l'état actuel des fichiers présents dans ce dossier.

## Contenu du dossier

- `main.tf` — Définit : resource group, log analytics workspace, container app environment et la container app (image, variables d'environnement, ingress avec restrictions IP Cloudflare).
- `variables.tf` — Toutes les variables utilisées (subscription, noms, image, credentials AWS/DB, tags, custom domain, etc.).
- `outputs.tf` — Sorties utiles : `container_app_fqdn`, `container_app_url`, `resource_group_name`, `container_app_environment_name`, `log_analytics_workspace_id`.
- `versions.tf` — Provider / versions Terraform (vérifier si présent pour la compatibilité).
- `terraform.tfvars` — Valuers locales (NE PAS committer si elles contiennent des secrets) — exemple disponible en `terraform.tfvars.example`.
- `set-azure-env.sh` — Script d'aide pour injecter les variables d'environnement Azure dans le shell avant d'exécuter Terraform (cf. section "Scripts").
- `.terraform/`, `terraform.tfstate`, `terraform.tfstate.backup` — état local (ne pas committer en remote). Le repository contient un `terraform.tfvars` local pour usage personnel.

## Principales caractéristiques

- Container App configurée pour : CPU 0.25, mémoire 0.5Gi, port 3001, `min_replicas = 0` et `max_replicas = 1` (scale-to-zero possible).
- Ingress externe activé avec `allow_insecure_connections = true` (TLS géré automatiquement par Azure) et restrictions d'accès aux plages IP Cloudflare (plusieurs `ip_security_restriction` définies dans `main.tf`).
- L'application récupère de nombreuses variables d'environnement (DB, AWS, Cognito...). Ces variables sensibles sont définies via `variables.tf` et peuvent être fournies via `terraform.tfvars` ou d'un mécanisme externe (Key Vault).

## Prérequis

1. Terraform installé (idéalement >= 1.0).
2. Compte/abonnement Azure avec autorisations pour créer des ressources (Resource Group, Log Analytics, Container Apps) — accès nécessaire d'une manière ou d'une autre.

Remarque importante sur l'authentification : l'Azure CLI (`az`) n'est pas strictement requis. Terraform peut s'authentifier de plusieurs façons :

- Exporter les variables d'environnement ARM (`ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`) — par exemple via `set-azure-env.sh` (voir la section « Scripts utiles »).
- Utiliser l'Azure CLI (`az login`) pour une authentification interactive si tu préfères.
- Utiliser un mécanisme centralisé comme Terraform Cloud / Terraform Enterprise ou Managed Identity (selon le contexte) pour éviter d'exposer des secrets locaux.

Choisis l'approche d'authentification qui convient le mieux à ton workflow — l'important est que Terraform ait des identifiants valides pour accéder à ton subscription.

## Bonnes pratiques de sécurité

- Ne pas committer `terraform.tfvars` s'il contient des secrets. Un fichier `terraform.tfvars.example` est fourni.
- Préférer Azure Key Vault + provider `azurerm_key_vault` pour secrets en production.
- Vérifier les règles `ip_security_restriction` si vous utilisez un CDN/proxy (ex : Cloudflare). Les plages sont présentes dans `main.tf` — mettez-les à jour si nécessaire.

## Scripts utiles

- `set-azure-env.sh` : script d'aide pour exporter des variables Azure (subscription, resource group, etc.) dans votre shell. Exemple d'usage :

```bash
cd terraform
source ./set-azure-env.sh
# puis
terraform init
terraform plan
terraform apply
```

Vérifiez le contenu du script avant de l'exécuter.

Attention : le fichier `set-azure-env.sh` dans ce dépôt contient des valeurs ARM hardcodées (client id / client secret / subscription / tenant). Il ne faut PAS committer des secrets en clair :

- Supprime ou sécurise les secrets dans `set-azure-env.sh` avant de le partager.
- Préfère stocker les secrets dans un gestionnaire de secrets (Azure Key Vault, HashiCorp Vault) ou utilise Terraform Cloud pour gérer les variables sensibles.
- Si tu utilises `az login`, l'Azure CLI reste optionnelle et sert seulement pour l'authentification interactive.

## Déploiement (exemples)

1) Se connecter et sélectionner la subscription

```bash
az login
az account set --subscription "258231c8-4812-401c-8826-74d237aaa2b2"
```

2) Initialiser Terraform

```bash
cd terraform
terraform init
```

3) Planifier et appliquer

```bash
terraform validate
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

4) Pour détruire les ressources

```bash
terraform destroy
```

## Variables sensibles et recommandations

- Variables sensibles présentes dans `variables.tf` : `db_password`, `aws_access_key_id`, `aws_secret_access_key` (marquées `sensitive = true`). Fournissez-les via un fichier `terraform.tfvars` local, via des variables d'environnement (TF_VAR_...) ou via un secret manager.
- Le `container_image` par défaut est `rbndjx/portfolio-backend:latest`. Mettez à jour le tag si vous publiez des versions.

## Sorties utiles

Après `apply`, Terraform produit plusieurs outputs définis dans `outputs.tf` ; les plus utiles :

- `container_app_fqdn` — FQDN retourné par Azure pour la révision la plus récente.
- `container_app_url` — URL complète (https).
- `log_analytics_workspace_id` — utile pour vérifier l'intégration des logs.

## Notes spécifiques

- Region par défaut dans `variables.tf` : `France Central`.
- `environment_name` par défaut : `portfolio-env`.
- `custom_domain` est présent dans `variables.tf` mais non automatiquement configuré dans `main.tf` — si vous souhaitez lier un domaine personnalisé, ajoutez la configuration correspondante (validation de certificat / managed certificate) et la ressource `azurerm_container_app_custom_domain` si nécessaire.

## Support & documentation

- Azure Container Apps : https://learn.microsoft.com/azure/container-apps/
- Terraform Provider AzureRM : https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs

---

Mise à jour réalisée : corrélation avec les fichiers actuels (`main.tf`, `variables.tf`, `outputs.tf`) et inclusion d'informations sur les scripts et règles IP Cloudflare.