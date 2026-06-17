# PaperStudio Threat Model

## System Assets

- User accounts and authentication tokens.
- Password hashes and account recovery codes.
- Product catalog and admin inventory functions.
- Cart and order data.
- Payment workflow metadata.
- Product images stored in S3.
- AWS infrastructure configuration.
- CloudTrail and CloudWatch audit logs.
- RDS PostgreSQL database.

## Trust Boundaries

1. Public internet to application frontend/backend.
2. Frontend client to backend API.
3. Backend API to PostgreSQL database.
4. Backend API to S3 object storage.
5. Backend API to Stripe payment services.
6. Application tier to AWS control plane services.
7. Admin users to privileged application functions.

## STRIDE-Style Threat Mapping

| Threat Category | Example Risk | Existing or Planned Mitigation |
|---|---|---|
| Spoofing | Attacker attempts to log in as another user | bcrypt password hashing, JWT authorization, login OTP flow, auth rate limiting |
| Tampering | User modifies another user's cart/order or changes admin-only data | Protected routes, user ID checks in controllers, admin RBAC middleware |
| Repudiation | User or admin action cannot be investigated later | CloudTrail/CloudWatch design, server logging, future structured audit logging |
| Information Disclosure | Database host, errors, logs, or S3 objects leak sensitive data | Error handler, environment variable use, planned private RDS, S3 hardening, remove diagnostic endpoints |
| Denial of Service | Automated requests overload login, contact, or API endpoints | API rate limiting, auth-specific rate limiting, contact form rate limiting |
| Elevation of Privilege | Customer reaches admin-only product/order/coupon functionality | JWT claims, auth middleware, admin authorization middleware |

## Application Threats and Mitigations

### Credential Stuffing / Brute Force

**Risk:** Attackers attempt repeated login attempts against user accounts.

**Mitigations:**

- Authentication endpoint rate limiting.
- Password hashing with bcrypt.
- MFA/OTP workflow for non-admin accounts.
- Generic error messages for invalid credentials.

**Future Hardening:**

- Add account lockout or risk-based throttling.
- Require MFA for admin accounts.
- Add audit events for failed login attempts.

### Broken Access Control

**Risk:** A customer attempts to access admin product, coupon, order, or contact management features.

**Mitigations:**

- Protected routes require a valid JWT.
- Admin middleware checks the authenticated user's role.
- Customer-specific queries restrict access to the authenticated user's data.

**Future Hardening:**

- Add automated authorization tests.
- Avoid trusting client-side role checks for navigation security.

### XSS and Malicious Input

**Risk:** User-provided fields contain script or HTML payloads.

**Mitigations:**

- express-validator field validation.
- Recursive sanitization middleware removes HTML tags from request data.
- Field length limits on contact messages and other inputs.

**Future Hardening:**

- Use a mature HTML sanitizer where rich text is required.
- Enable a strict Content Security Policy in production.

### Malicious File Uploads

**Risk:** Attacker uploads unexpected file types or oversized files.

**Mitigations:**

- Multer memory storage.
- MIME allowlisting for JPEG, PNG, GIF, and WebP.
- 5 MB file size limit.
- S3 object upload flow separates images from application code.

**Future Hardening:**

- Validate file signatures, not just MIME type.
- Scan uploaded files with an AV/malware service.
- Serve uploads from a separate domain or CloudFront distribution.

### Cloud Misconfiguration

**Risk:** Public S3 access, exposed RDS, excessive IAM permissions, or limited logging.

**Mitigations:**

- CloudTrail and CloudWatch logging design.
- KMS encryption strategy.
- VPC segmentation design.
- Prowler posture assessment.
- Planned private subnet placement for RDS.

**Future Hardening:**

- Use Infrastructure as Code to make security controls repeatable.
- Add CloudFront Origin Access Control in front of S3.
- Define least-privilege IAM policies and remove broad managed policies.

### Payment Workflow Abuse

**Risk:** Attacker tampers with payment status or forges webhook events.

**Mitigations:**

- Checkout sessions are created for authenticated users and tied to order IDs.
- Stripe webhook signature verification is supported when a webhook secret is configured.
- Order status is updated only after checkout completion events.

**Future Hardening:**

- Require webhook signature verification in every deployed environment.
- Log payment state transitions.
- Add reconciliation checks between Stripe and local order state.
