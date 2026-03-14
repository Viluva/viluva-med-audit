# Security Implementation

## Overview
MedClarity implements multiple layers of security to protect users and ensure service reliability.

## Security Features

### 1. API Rate Limiting
- **Limit**: 100 requests per minute per IP address
- **Window**: Rolling 60-second window
- **Response**: HTTP 429 (Too Many Requests) when limit exceeded
- **Headers**: Includes `Retry-After` and rate limit information

### 2. Input Sanitization
- All user inputs are sanitized to prevent XSS attacks
- HTML tags and special characters are stripped
- Input length is capped at 100 characters
- Alphanumeric characters, spaces, and safe punctuation only

### 3. Security Headers
The following security headers are implemented:

#### Application-wide (via next.config.ts)
- `X-DNS-Prefetch-Control: on`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### API Endpoints (via route handlers)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4. CORS Configuration
- **Allowed Origins**: Currently set to `*` (configure for production)
- **Allowed Methods**: GET, OPTIONS
- **Allowed Headers**: Content-Type
- **Preflight**: OPTIONS requests properly handled

## Data Privacy

### No Data Collection
- No user data is stored in databases
- No personal information is collected
- No cookies are used for tracking
- No analytics on user searches

### Client-Side Processing
- All calculations performed in browser
- No hospital bill amounts transmitted
- No procedure searches logged

## Production Recommendations

### Before Deployment

1. **CORS Configuration**
   - Update `Access-Control-Allow-Origin` in `/src/app/api/audit/search/route.ts`
   - Replace `*` with your specific domain(s)

2. **Rate Limiting Enhancement**
   - Consider using Redis for distributed rate limiting
   - Adjust limits based on expected traffic
   - Implement tiered rate limits for different user types

3. **HTTPS Only**
   - Ensure HTTPS is enforced in production
   - Verify SSL certificate validity
   - Enable HSTS preload

4. **Content Security Policy**
   - Add CSP headers to prevent inline scripts
   - Whitelist only trusted domains

5. **Environment Variables**
   - Store sensitive configuration in environment variables
   - Never commit secrets to version control

### Monitoring

1. **Error Tracking**
   - Implement error monitoring (e.g., Sentry)
   - Track failed API requests
   - Monitor rate limit violations

2. **Performance Monitoring**
   - Track API response times
   - Monitor rate limit effectiveness
   - Alert on unusual traffic patterns

### Regular Maintenance

1. **Dependency Updates**
   - Regularly update npm packages
   - Monitor security advisories
   - Run `npm audit` regularly

2. **Security Audits**
   - Periodic penetration testing
   - Code review for new features
   - Stay updated on OWASP Top 10

## Incident Response

If you discover a security vulnerability:
1. Do not publicly disclose the issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before disclosure

## Data Source Integrity

### Official Data
- Hospital data from CGHS Empanelment 2026 (21 cities)
- Price data from MoHFW CGHS Rate Guidelines
- Data files located in `/src/lib/data/`

### Data Validation
- JSON data is typed with TypeScript interfaces
- Runtime validation for user inputs
- Tier mapping validation before queries

## Compliance

### Legal Disclaimers
- Clear disclosure that tool is informational only
- Not legal or medical advice
- Users advised to consult professionals
- No liability for decisions made using the tool

### Transparency
- Open source codebase
- Clear data source attribution
- Calculation methodology documented

## Known Limitations

1. **Rate Limiting Storage**
   - In-memory storage (not distributed)
   - Resets on server restart
   - Consider Redis for production

2. **Large JSON Files**
   - 53,947 price entries served directly
   - Consider pagination or search optimization for better performance

3. **No User Authentication**
   - All users treated equally for rate limiting
   - No ability to track individual usage patterns

## Future Security Enhancements

- [ ] Implement Content Security Policy (CSP)
- [ ] Add subresource integrity (SRI) for external resources
- [ ] Implement request signing for API calls
- [ ] Add honeypot fields for bot detection
- [ ] Implement CAPTCHA for high-volume users
- [ ] Add IP reputation checking
- [ ] Implement DDoS protection at CDN level
