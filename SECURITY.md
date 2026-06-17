# Security Policy

## Project Scope

PaperStudio is an academic mock e-commerce application used to demonstrate full-stack development and cloud security design. The project includes a React frontend, Node.js/Express backend, PostgreSQL database layer, S3 image storage, Stripe payment workflow, and AWS deployment/security architecture.

## Security Controls Demonstrated

- JWT-based authentication for protected routes.
- bcrypt password hashing.
- Email verification and OTP-based login flow.
- Role-based access control for customer and admin permissions.
- Input validation using express-validator.
- Request sanitization to reduce XSS risk.
- API and authentication rate limiting.
- File upload allowlisting and size limits.
- Stripe webhook handling with signature verification when a webhook secret is configured.
- AWS security design using IAM, KMS, CloudTrail, CloudWatch, VPC segmentation, S3, RDS, and AWS Backup.

## Known Hardening Items

This project should not be considered production-ready until the following items are addressed:

1. Remove fallback JWT secrets and require strong environment-provided secrets.
2. Require MFA for administrator accounts.
3. Enable production Helmet protections, including CSP and HSTS.
4. Disable `/api/db-test` in production or restrict it to authenticated administrators.
5. Require Stripe webhook signature verification in all deployed environments.
6. Hash OTP, email verification, and password reset codes before database storage.
7. Restrict production CORS to approved frontend domains only.
8. Move database resources into private subnets and restrict access to application security groups.
9. Add automated dependency scanning, secret scanning, SAST, and vulnerability checks to CI/CD.
10. Remove deployment logs, generated ZIP bundles, and temporary URLs from the repository history.

## Responsible Use

This project is for educational and portfolio purposes only. Do not use it to store real customer data, process real payments, or host production workloads without a complete security assessment.
