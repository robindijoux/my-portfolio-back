# main.tf

# Locals pour centraliser les tags
locals {
  common_tags = merge({
    Project        = var.project_name
    Environment    = var.environment
    Owner          = var.owner
    ContactEmail   = var.contact_email
    CostCenter     = var.cost_center
    Repository     = var.repository
    ManagedBy      = "Terraform"
    CreatedDate    = formatdate("YYYY-MM-DD", timestamp())
    LastModified   = formatdate("YYYY-MM-DD", timestamp())
    ResourceGroup  = var.resource_group_name
    Location       = var.location
  }, var.additional_tags)
}

# Resource Group
resource "azurerm_resource_group" "portfolio" {
  name     = var.resource_group_name
  location = var.location

  tags = local.common_tags
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "portfolio_logs" {
  name                = var.log_analytics_workspace_name
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = merge(local.common_tags, {
    ResourceType = "Log Analytics Workspace"
    Purpose      = "Application monitoring and logging"
  })
}

# Container App Environment
resource "azurerm_container_app_environment" "portfolio_env" {
  name                       = var.environment_name
  location                   = azurerm_resource_group.portfolio.location
  resource_group_name        = azurerm_resource_group.portfolio.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.portfolio_logs.id

  tags = merge(local.common_tags, {
    ResourceType = "Container App Environment"
    Purpose      = "Container application hosting environment"
  })
}

# Container App
resource "azurerm_container_app" "portfolio_api" {
  name                         = var.app_name
  container_app_environment_id = azurerm_container_app_environment.portfolio_env.id
  resource_group_name          = azurerm_resource_group.portfolio.name
  revision_mode                = "Single"

  template {
    container {
      name   = "portfolio-api"
      image  = var.container_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = tostring(var.container_port)
      }

      env {
        name  = "FRONTEND_URL"
        value = var.frontend_url
      }

      env {
        name  = "DB_HOST"
        value = var.db_host
      }

      env {
        name  = "DB_PORT"
        value = tostring(var.db_port)
      }

      env {
        name  = "DB_USERNAME"
        value = var.db_username
      }

      env {
        name  = "DB_PASSWORD"
        value = var.db_password
      }

      env {
        name  = "DB_NAME"
        value = var.db_name
      }

      env {
        name  = "DB_SYNC"
        value = var.db_sync
      }

      env {
        name  = "AWS_REGION"
        value = var.aws_region
      }

      env {
        name  = "AWS_S3_BUCKET_NAME"
        value = var.aws_s3_bucket_name
      }

      env {
        name  = "AWS_ACCESS_KEY_ID"
        value = var.aws_access_key_id
      }

      env {
        name  = "AWS_SECRET_ACCESS_KEY"
        value = var.aws_secret_access_key
      }

      env {
        name  = "AWS_COGNITO_USER_POOL_ID"
        value = var.aws_cognito_user_pool_id
      }

      env {
        name  = "AWS_COGNITO_CLIENT_ID"
        value = var.aws_cognito_client_id
      }
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    allow_insecure_connections = true
    external_enabled           = true
    target_port               = var.container_port

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }

    # Restriction d'accès aux IPs Cloudflare uniquement
    ip_security_restriction {
      name             = "cloudflare-1"
      action           = "Allow"
      ip_address_range = "173.245.48.0/20"
      description      = "Cloudflare IP range 1"
    }
    ip_security_restriction {
      name             = "cloudflare-2"
      action           = "Allow"
      ip_address_range = "103.21.244.0/22"
      description      = "Cloudflare IP range 2"
    }
    ip_security_restriction {
      name             = "cloudflare-3"
      action           = "Allow"
      ip_address_range = "103.22.200.0/22"
      description      = "Cloudflare IP range 3"
    }
    ip_security_restriction {
      name             = "cloudflare-4"
      action           = "Allow"
      ip_address_range = "103.31.4.0/22"
      description      = "Cloudflare IP range 4"
    }
    ip_security_restriction {
      name             = "cloudflare-5"
      action           = "Allow"
      ip_address_range = "141.101.64.0/18"
      description      = "Cloudflare IP range 5"
    }
    ip_security_restriction {
      name             = "cloudflare-6"
      action           = "Allow"
      ip_address_range = "108.162.192.0/18"
      description      = "Cloudflare IP range 6"
    }
    ip_security_restriction {
      name             = "cloudflare-7"
      action           = "Allow"
      ip_address_range = "190.93.240.0/20"
      description      = "Cloudflare IP range 7"
    }
    ip_security_restriction {
      name             = "cloudflare-8"
      action           = "Allow"
      ip_address_range = "188.114.96.0/20"
      description      = "Cloudflare IP range 8"
    }
    ip_security_restriction {
      name             = "cloudflare-9"
      action           = "Allow"
      ip_address_range = "197.234.240.0/22"
      description      = "Cloudflare IP range 9"
    }
    ip_security_restriction {
      name             = "cloudflare-10"
      action           = "Allow"
      ip_address_range = "198.41.128.0/17"
      description      = "Cloudflare IP range 10"
    }
    ip_security_restriction {
      name             = "cloudflare-11"
      action           = "Allow"
      ip_address_range = "162.158.0.0/15"
      description      = "Cloudflare IP range 11"
    }
    ip_security_restriction {
      name             = "cloudflare-12"
      action           = "Allow"
      ip_address_range = "104.16.0.0/13"
      description      = "Cloudflare IP range 12"
    }
    ip_security_restriction {
      name             = "cloudflare-13"
      action           = "Allow"
      ip_address_range = "104.24.0.0/14"
      description      = "Cloudflare IP range 13"
    }
    ip_security_restriction {
      name             = "cloudflare-14"
      action           = "Allow"
      ip_address_range = "172.64.0.0/13"
      description      = "Cloudflare IP range 14"
    }
    ip_security_restriction {
      name             = "cloudflare-15"
      action           = "Allow"
      ip_address_range = "131.0.72.0/22"
      description      = "Cloudflare IP range 15"
    }
  }

  tags = merge(local.common_tags, {
    ResourceType = "Container App"
    Purpose      = "Backend API for portfolio website"
    ExposedPort  = tostring(var.container_port)
    ImageName    = var.container_image
  })
}

# Container App Custom Domain avec certificat managé automatique
resource "azurerm_container_app_custom_domain" "portfolio_custom_domain" {
  name             = var.custom_domain
  container_app_id = azurerm_container_app.portfolio_api.id

  # Azure générera automatiquement un certificat Let's Encrypt
  certificate_binding_type = "Disabled"
}