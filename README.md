# Deno SMTP

## Docs
* [Deno](https://deno.land/)
* [Deno Deploy](https://deno.com/deploy/docs)
* [oak](https://deno.land/x/oak@v9.0.0)
* [smpt](https://deno.land/x/smtp@v0.7.0)

```
# run app
DEBUG=true SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER="john.doe@example.com" SMTP_PASS="secret" REQUEST_TOKEN=abcd1234 deno run --allow-net --allow-env mod.ts
```