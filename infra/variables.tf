variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region for the Firebase project"
  type        = string
  default     = "us-central1"
}

variable "firestore_location" {
  description = "The location for the Firestore database"
  type        = string
  default     = "nam5"
}
