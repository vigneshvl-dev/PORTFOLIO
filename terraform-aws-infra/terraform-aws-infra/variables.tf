variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "us-east-1"
}

variable "key_name" {
  description = "Name of the SSH key pair to use"
  default     = "my-key-pair"
}
