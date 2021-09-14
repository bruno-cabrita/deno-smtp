# Deno SMTP

```
# run app
DEBUG=true SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER="john.doe@example.com" SMTP_PASS="secret" REQUEST_TOKEN=abcd1234 deno run --allow-net --allow-env mod.ts
```