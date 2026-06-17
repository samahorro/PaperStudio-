# PaperStudio Security Architecture

## Overview

PaperStudio is a three-tier e-commerce application with application-layer security controls and an AWS cloud security design. The project demonstrates how a small web application can be hardened using identity controls, secure API design, cloud logging, encryption planning, backup strategy, and framework-based posture assessment.

## Architecture Layers

### 1. Web and Application Tier

- React/Vite frontend provides the user interface.
- Node.js/Express backend exposes REST API endpoints.
- Elastic Beanstalk provides the AWS compute platform for the deployed application.
- Express middleware enforces API security controls including authentication, rate limiting, validation, sanitization, CORS restrictions, and baseline security headers.

### 2. Identity and Access Layer

Application-level identity controls include:

- JWT authorization for protected API routes.
- Customer and admin roles.
- Admin-only route middleware for privileged actions.
- Email verification during registration.
- OTP/MFA workflow for customer logins.
- Password reset flow using time-limited codes.

Cloud-level identity controls include:

- IAM instance profile for Elastic Beanstalk EC2 service access.
- Least-privilege IAM design goals for S3, RDS, logging, and backup operations.
- Future separation between product administrators and system administrators.

### 3. Data Layer

- PostgreSQL is used as the relational database through Sequelize ORM.
- User, product, cart, order, coupon, and contact data are modeled separately.
- RDS is the target production database platform.
- Design goal: RDS should be reachable only from the application tier inside the VPC.

### 4. Storage Layer

- S3 stores product images.
- File upload controls limit uploads to common image MIME types and enforce a 5 MB limit.
- Future hardening should place CloudFront with Origin Access Control in front of S3 and disable direct public bucket access.

### 5. Logging and Detection Layer

- CloudTrail captures AWS API activity.
- CloudWatch stores logs for investigation.
- Logs Insights queries support detection use cases such as unusual IAM activity, S3 policy changes, suspicious authentication events, or infrastructure changes.
- Prowler was used as the AWS security posture assessment tool.

### 6. Encryption and Key Management Layer

- KMS customer-managed keys were part of the security design for S3 and RDS encryption.
- Annual key rotation was included in the design.
- Future improvement: document key policies and access boundaries for each CMK.

### 7. Resilience Layer

- AWS Backup was included for daily RDS snapshots.
- Backup retention was planned for 35 days.
- Future improvement: add restore testing and document recovery time/recovery point objectives.

## Security Design Goals

- Reduce credential-based attacks through hashing, rate limiting, email verification, and MFA/OTP workflows.
- Limit damage from compromised accounts using role-based access control and least privilege.
- Reduce input-driven attacks using validation, sanitization, and file upload restrictions.
- Improve cloud visibility using CloudTrail, CloudWatch, and Prowler.
- Reduce infrastructure blast radius through VPC segmentation and private database access.
- Improve recovery readiness through backups and retention planning.

## Production Hardening Priorities

1. Fail closed if security-critical environment variables are missing.
2. Remove admin MFA bypass.
3. Enable strict production HTTP security headers.
4. Disable public diagnostic endpoints.
5. Enforce signed Stripe webhooks.
6. Add CI/CD security checks.
7. Move database resources to private subnets.
8. Replace direct S3 public access with CloudFront Origin Access Control.
