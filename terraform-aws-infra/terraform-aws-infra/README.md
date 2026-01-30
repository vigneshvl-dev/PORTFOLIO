# 🧱 Infrastructure as Code (IaC) - AWS with Terraform

This project automates the deployment of cloud infrastructure on AWS using Terraform. It provisions a secure AWS EC2 instance and automatically bootstraps it with Docker to run a containerized web application.

## 🛠️ Infrastructure Created
- **AWS EC2 Instance**: T2.micro running Amazon Linux 2.
- **Security Group**: Configured to allow HTTP (80), Custom App (5000), and SSH (22) traffic.
- **Auto-Provisioning**: Uses `user_data` script to verify system updates, install Docker, and launch the application container immediately upon boot.

## 🚀 Usage
1. **Initialize Terraform**:
   ```bash
   terraform init
   ```
2. **Preview Changes**:
   ```bash
   terraform plan
   ```
3. **Deploy Infrastructure**:
   ```bash
   terraform apply
   ```

## 📋 Prerequisites
- Terraform installed
- AWS CLI configured with credentials
- An existing AWS Key Pair (update `variables.tf`)
