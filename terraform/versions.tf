# versions.tf

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
  
  # Les variables d'environnement ARM_CLIENT_ID, ARM_CLIENT_SECRET, 
  # ARM_TENANT_ID et ARM_SUBSCRIPTION_ID seront utilisées automatiquement
}