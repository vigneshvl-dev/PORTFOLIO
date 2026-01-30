output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.web_server.public_ip
}

output "app_url" {
  description = "URL to access the application"
  value       = "http://${aws_instance.web_server.public_ip}"
}
