# variables.tf

variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  default     = "258231c8-4812-401c-8826-74d237aaa2b2"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "portfolio"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "France Central"
}

variable "app_name" {
  description = "Name of the container app"
  type        = string
  default     = "portfolio-backend"
}

variable "container_image" {
  description = "Container image to deploy"
  type        = string
  default     = "rbndjx/portfolio-backend:latest"
}

variable "container_port" {
  description = "Port that the container listens on"
  type        = number
  default     = 3001
}

# Environment variables for the application
variable "frontend_url" {
  description = "Frontend URL for CORS"
  type        = string
  default     = ""
}

variable "db_host" {
  description = "Database host"
  type        = string
  default     = ""
}

variable "db_port" {
  description = "Database port"
  type        = number
  default     = 5432
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = ""
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = ""
}

variable "db_sync" {
  description = "Database sync mode"
  type        = string
  default     = "false"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "aws_s3_bucket_name" {
  description = "AWS S3 bucket name"
  type        = string
  default     = ""
}

variable "aws_access_key_id" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_cognito_user_pool_id" {
  description = "AWS Cognito user pool ID"
  type        = string
  default     = ""
}

variable "aws_cognito_client_id" {
  description = "AWS Cognito client ID"
  type        = string
  default     = ""
}

variable "environment_name" {
  description = "Name of the Container App Environment"
  type        = string
  default     = "portfolio-env"
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  type        = string
  default     = "portfolio-logs"
}

# Tags variables
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "Portfolio Robin Dijoux"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "Robin Dijoux"
}

variable "contact_email" {
  description = "Contact email for the resources"
  type        = string
  default     = "contact@robindijoux.fr"
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "portfolio"
}

variable "repository" {
  description = "Git repository URL"
  type        = string
  default     = "https://github.com/robindijoux/my-portfolio-back"
}

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "custom_domain" {
  description = "Custom domain for the container app"
  type        = string
  default     = "api.robindijoux.fr"
}