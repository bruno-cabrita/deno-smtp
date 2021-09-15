import { SmtpClient, SendConfig } from "./deps.ts";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

const smtp: SmtpConfig = {
  host: Deno.env.get("SMTP_HOST") || "smtp.example.com",
  port: Number(Deno.env.get("SMTP_PORT")) || 587,
  user: Deno.env.get("SMTP_USER") || "john.doe@example.com",
  pass: Deno.env.get("SMTP_PASS") || "secret",
};

export async function sendSmtpEmail(data: SendConfig) {

  const client = new SmtpClient();
  
  await client.connectTLS({
    hostname: smtp.host,
    port: smtp.port,
    username: smtp.user,
    password: smtp.pass,
  });
  
  await client.send({
    from: data.from,
    to: data.to,
    subject: data.subject,
    content: data.content,
    html: data.html,
  });
  
  return await client.close();
}
