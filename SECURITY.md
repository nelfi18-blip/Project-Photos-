# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Project Photos, please send an email to the maintainers or create a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- Acknowledgment of your vulnerability report within 48 hours
- Regular updates about our progress
- Notification when the vulnerability is fixed

## Security Best Practices

When deploying this application:

1. **Never commit secrets** - Use environment variables for all sensitive data
2. **Use strong JWT secrets** - Generate a strong random string for `JWT_SECRET`
3. **Enable HTTPS** - Always use HTTPS in production
4. **Keep dependencies updated** - Regularly run `npm audit` and update packages
5. **Restrict MongoDB access** - Don't allow public access to your database
6. **Use Cloudinary securely** - Keep your API secrets safe
7. **Implement rate limiting** - Already included in the backend
8. **Validate all inputs** - Sanitize user inputs to prevent injection attacks

## Disclosure Policy

We follow a coordinated disclosure process. We will:

1. Confirm the vulnerability
2. Determine the severity
3. Develop and test a fix
4. Release the fix
5. Publicly disclose the vulnerability details

Thank you for helping keep Project Photos and its users safe!
