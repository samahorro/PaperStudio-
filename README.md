# PaperStudio: Full-Stack Web App Security & Cloud Hardening

Full-stack e-commerce web app built with React, Node.js, PostgreSQL, and AWS, focused on cloud hardening, security monitoring, IAM/RBAC, API protection, logging, encryption, backups, and posture assessment.

PaperStudio is a full-stack mock e-commerce web application for stationery products. The project includes a React/Vite frontend, Node.js/Express backend, PostgreSQL data layer, and AWS cloud deployment design. Beyond building the frontend and backend, this repository documents how the application was hardened and assessed from a cybersecurity perspective.

The goal of this repo is to show how a small cloud-hosted web application can be improved using practical application security controls, AWS-native logging and monitoring, identity and access management, encryption planning, backup strategy, and compliance-aligned cloud security assessment.

## Why This Project Matters

Small web applications often fail because the security work stops after the app “works.” PaperStudio focuses on the next step: reducing risk after deployment. The project connects full-stack engineering with SOC/security analyst skills by showing how authentication, authorization, logs, cloud misconfigurations, API controls, and backup/recovery all affect the security posture of a real application environment.

## Project Highlights

- Built a full-stack e-commerce application with React, Node.js/Express, PostgreSQL, and Sequelize.
- Implemented secure backend controls including JWT authentication, bcrypt password hashing, role-based access control, input validation, request sanitization, and rate limiting.
- Designed AWS cloud hardening around Elastic Beanstalk, RDS PostgreSQL, S3, IAM, KMS, CloudTrail, CloudWatch, VPC segmentation, and AWS Backup.
- Added SOC-relevant logging and monitoring concepts using CloudTrail and CloudWatch Logs Insights for investigation and detection use cases.
- Used Prowler to assess AWS security posture and map findings to cloud security frameworks.
- Documented threats, trust boundaries, security controls, and future hardening steps.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Sequelize ORM |
| Authentication | JWT, bcrypt password hashing, email verification, OTP/MFA workflow |
| Security Middleware | Helmet, CORS controls, express-rate-limit, express-validator, custom sanitization middleware |
| File Storage | Amazon S3 |
| Payments | Stripe Checkout and webhook handling |
| Cloud Hosting | AWS Elastic Beanstalk, EC2, RDS, S3 |
| Security Monitoring / Hardening | CloudTrail, CloudWatch Logs Insights, KMS, AWS Backup, IAM, Prowler |

## Security-Focused Features

### Application Security

- Password hashing with bcrypt.
- JWT-based authorization for protected API routes.
- Role-based access control separating customer and admin functionality.
- Admin-only routes for product management, coupons, order status updates, and contact message review.
- Email verification during account registration.
- OTP/MFA login workflow for customer accounts.
- Password reset workflow using expiring verification codes.
- Centralized authentication and admin authorization middleware.

### API Hardening

- Global API rate limiting to reduce abuse and automated request flooding.
- Stricter authentication rate limiting for login, registration, and password reset endpoints.
- Contact form rate limiting to reduce spam.
- Input validation with express-validator.
- Recursive request sanitization middleware to reduce stored XSS risk from user-supplied input.
- File upload restrictions using image MIME allowlisting and upload size limits.
- CORS configuration designed to restrict production origins.
- Helmet security headers used as baseline HTTP hardening.

### Cloud Hardening and Monitoring

- Elastic Beanstalk application tier for AWS-hosted backend deployment.
- RDS PostgreSQL database tier designed for VPC-restricted access.
- S3 product image storage with future CloudFront Origin Access Control hardening path.
- IAM instance profile design for application-to-AWS service access.
- Customer-managed KMS key strategy for encryption at rest.
- CloudTrail API activity logging routed into CloudWatch for investigation and detection use cases.
- CloudWatch Logs Insights query strategy for suspicious cloud activity.
- AWS Backup strategy with daily RDS snapshots and defined retention.
- Custom VPC design with public/private subnets, NAT Gateway, Internet Gateway, VPN Gateway, and S3 VPC endpoint planning.

## Security Architecture Summary

PaperStudio follows a three-tier architecture with layered security controls:

1. **Web/Application Tier:** Elastic Beanstalk hosts the Node.js/Express API and serves the React application.
2. **Data Tier:** Amazon RDS PostgreSQL stores users, products, carts, orders, coupons, and contact messages.
3. **Storage Tier:** Amazon S3 stores product images and supports object delivery.
4. **Identity Layer:** IAM roles and application RBAC enforce least privilege at the cloud and application levels.
5. **Detection Layer:** CloudTrail and CloudWatch support audit logging and investigation.
6. **Resilience Layer:** AWS Backup and database snapshots support recovery planning.

See [`docs/security-architecture.md`](docs/security-architecture.md) for the full security architecture breakdown.

## Threat Model

The project considers common threats against a small AWS-hosted e-commerce application:

- Credential stuffing and brute-force login attempts.
- Excessive privilege or broken access control.
- Stored or reflected cross-site scripting through user-controlled fields.
- Malicious file uploads.
- Public cloud storage misconfiguration.
- Lack of audit visibility into AWS API activity.
- Database exposure from weak network segmentation.
- Payment workflow tampering.
- Insufficient backup and recovery planning.

## Compliance and Framework Mapping

| Framework | How PaperStudio Aligns |
|---|---|
| CIS AWS Foundations Benchmark | CloudTrail logging, S3 public access review, KMS rotation strategy, IMDSv2 hardening goal |
| NIST SP 800-53 Rev. 5 | Least privilege, audit logging, encryption at rest, backup/recovery, access control |
| AWS Well-Architected Security Pillar | Identity foundation, traceability, defense in depth, automated detection, incident-ready logging |
| CSA Pandemic Eleven | Addresses misconfiguration, IAM risk, insecure APIs, and limited cloud visibility |
| PCI DSS Concepts | Encryption in transit, restricted access, payment workflow separation, audit trail concepts |

## Repository Structure

```text
PaperStudio/
├── frontend/                  # React/Vite frontend
├── backend/                   # Node.js/Express API
│   ├── controllers/           # Auth, products, cart, orders, payments, coupons
│   ├── middleware/            # Auth, admin RBAC, validation, sanitization, rate limiting
│   ├── models/                # Sequelize models
│   ├── routes/                # API route definitions
│   └── server.js              # Express server configuration
├── docs/                      # Security documentation
│   ├── security-architecture.md
│   ├── threat-model.md
│   └── security-hardening-roadmap.md
├── SECURITY.md                # Security policy and known hardening items
└── README.md
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Required environment variables should be stored in a local `.env` file and never committed:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paperstudio
DB_USER=postgres
DB_PASSWORD=change-me
JWT_SECRET=replace-with-a-long-random-secret
STRIPE_SECRET_KEY=replace-with-test-key
STRIPE_WEBHOOK_SECRET=replace-with-webhook-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=paperstudio-images-2026
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Security Review Notes

This was an academic project and should not be treated as production-ready without further hardening. Important next steps include:

- Remove fallback JWT secrets and fail closed when required secrets are missing.
- Require MFA for admin accounts.
- Enable stricter Helmet settings in production, including Content Security Policy and HSTS.
- Disable or restrict `/api/db-test` in production to avoid information disclosure.
- Require Stripe webhook signature verification in deployed environments.
- Store OTP and password reset codes as hashes instead of plaintext values.
- Move RDS fully into private subnets and restrict inbound database access to the application tier.
- Place CloudFront with Origin Access Control in front of S3 and disable direct public bucket access.
- Add dependency scanning, secret scanning, and SAST to the GitHub Actions pipeline.

## Future Improvements

- Infrastructure as Code using Terraform or AWS CloudFormation.
- GitHub Actions security pipeline with dependency review, npm audit, CodeQL, and secret scanning.
- AWS WAF rules for common web attacks.
- GuardDuty or equivalent cloud threat detection if budget allows.
- Centralized security dashboards for CloudWatch detection queries.
- Sanitized Prowler scan reports in a dedicated `security-assessments/` directory.
- Formal incident response runbook for credential compromise, S3 exposure, payment abuse, and database access events.

## Disclaimer

PaperStudio is an academic mock e-commerce project. The repository is intended to demonstrate secure design thinking, full-stack development, cloud hardening, security monitoring, and posture assessment. Do not use this project to process real payments, customer data, or production workloads without a full security review.
