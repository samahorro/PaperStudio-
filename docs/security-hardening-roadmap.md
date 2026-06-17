# Security Hardening Roadmap

## High Priority

- Remove fallback JWT secrets from backend code.
- Require strong `JWT_SECRET` and other secrets through environment variables.
- Require MFA for admin accounts.
- Enable Helmet CSP and HSTS in production.
- Disable or admin-protect `/api/db-test`.
- Require Stripe webhook signature verification in deployed environments.
- Remove deployment logs, generated ZIP bundles, and temporary signed URLs from the repository.
- Add `.env` to `.gitignore` and provide `.env.example` instead.

## Medium Priority

- Hash email verification, login OTP, and password reset codes before storage.
- Add structured audit logging for login attempts, admin actions, order changes, and payment events.
- Add automated authorization tests for every admin endpoint.
- Add dependency scanning with Dependabot and GitHub dependency review.
- Add CodeQL or another SAST tool to the GitHub Actions pipeline.
- Add secret scanning and pre-commit checks.
- Move RDS into private subnets and restrict inbound access to the application security group.
- Place CloudFront with Origin Access Control in front of S3 and turn on S3 Block Public Access.

## Long-Term Improvements

- Convert the AWS environment to Terraform or CloudFormation.
- Add WAF rules for common web attacks.
- Add GuardDuty or a free/low-cost compensating detection strategy.
- Add CloudWatch dashboards for security events.
- Add incident response runbooks for credential compromise, public S3 exposure, suspicious admin activity, and payment abuse.
- Add backup restore tests and document RTO/RPO.
- Add threat model updates after each major feature release.

## Suggested GitHub Cleanup

Remove the following from the public repository before publishing:

- Generated deployment ZIP files.
- Elastic Beanstalk tail logs.
- Temporary log URL files.
- Bundle logs.
- Any environment-specific identifiers that are not needed for portfolio review.
- Large duplicated media files where possible.

Use `.gitignore` to prevent these files from being recommitted.
