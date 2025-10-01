# outputs.tf

output "container_app_fqdn" {
  description = "The FQDN of the Container App"
  value       = azurerm_container_app.portfolio_api.latest_revision_fqdn
}

output "container_app_url" {
  description = "The URL of the Container App"
  value       = "https://${azurerm_container_app.portfolio_api.latest_revision_fqdn}"
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.portfolio.name
}

output "container_app_environment_name" {
  description = "Name of the Container App Environment"
  value       = azurerm_container_app_environment.portfolio_env.name
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.portfolio_logs.id
}