terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "firebase" {
  service = "firebase.googleapis.com"
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [
    google_project_service.firebase
  ]
}

resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "Budget Tracker Web App"

  depends_on = [
    google_firebase_project.default
  ]
}

resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"

  depends_on = [
    google_firebase_project.default
  ]
}

resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.firestore_location
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_project_service.firestore
  ]
}

resource "google_firebase_project_location" "default" {
  provider    = google-beta
  project     = var.project_id
  location_id = var.region

  depends_on = [
    google_firebase_project.default
  ]
}

# Enable Identity Platform (Authentication)
resource "google_identity_platform_config" "default" {
  project = var.project_id

  depends_on = [
    google_firebase_project.default
  ]
}

# Enable Email/Password sign-in method
resource "google_identity_platform_project_default_config" "default" {
  project = var.project_id
  sign_in {
    allow_duplicate_emails = false

    email {
      enabled = true
    }
  }

  depends_on = [
    google_identity_platform_config.default
  ]
}

output "firebase_config" {
  value = {
    project_id          = var.project_id
    app_id              = google_firebase_web_app.default.app_id
    api_key             = google_firebase_web_app.default.api_key
    auth_domain         = "${var.project_id}.firebaseapp.com"
    database_url        = "https://${var.project_id}.firebaseio.com"
    storage_bucket      = "${var.project_id}.appspot.com"
    messaging_sender_id = google_firebase_web_app.default.messaging_sender_id
  }
  sensitive = true
}
