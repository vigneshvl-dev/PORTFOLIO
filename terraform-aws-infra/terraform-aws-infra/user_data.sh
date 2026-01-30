#!/bin/bash
# Update and install Docker
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Pull and run the container (Using the image from your CI/CD project!)
# Note: Ensure this image exists on DockerHub or use 'nginx' for testing
sudo docker run -d -p 80:5000 vigneshvl-dev/cicd-web-app:latest
