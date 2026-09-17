---
inclusion: always
---

## Vercel Clean URLs for HTML Projects

For any static HTML project deployed to Vercel:

1. Always create a `vercel.json` at the project root with `"cleanUrls": true` and `"trailingSlash": false`.
2. This strips `.html` extensions from all routes (e.g., `/404` instead of `/404.html`).
3. Include security headers in `vercel.json`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
4. All internal links and sitemap references should use clean URLs (no `.html` suffix).
