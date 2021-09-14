import { Application, Router, Context } from "https://deno.land/x/oak@v9.0.0/mod.ts";
import { SmtpClient, SendConfig } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface RequestBody {
  token: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

const isDebug: boolean = Deno.env.get("DEBUG") === "true";
const token: string = Deno.env.get("REQUEST_TOKEN") || 'abcd1234';
const smtp: SmtpConfig = {
  host: Deno.env.get("SMTP_HOST") || "smtp.example.com",
  port: Number(Deno.env.get("SMTP_PORT")) || 587,
  user: Deno.env.get("SMTP_USER") || "john.doe@example.com",
  pass: Deno.env.get("SMTP_PASS") || "secret",
};

async function sendSmtpEmail(data: SendConfig) {

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

async function sendEmailRequest(ctx: Context) {
  console.log(`${ctx.request.ip} @ ${new Date().toJSON()} → ${ctx.request.method}${ctx.request.url.pathname}`);
    
  if(!isDebug && !ctx.request.secure) {
    ctx.response.status = 406;
    ctx.response.body = `Request is not secure! Please make sure that the request url starts with "https://"`;
    return;
  }

  if(!ctx.request.hasBody) {
    ctx.response.status = 406;
    ctx.response.body = `Invalid request body!`;
    return;
  }

  const reqBody = ctx.request.body({type:"json"});

  // @TODO validate request type: json

  const body: RequestBody = await reqBody.value;

  // @TODO: validate body fields

  if(body?.token !== token) {
    ctx.response.status = 406;
    ctx.response.body = `Invalid token!`;
    return;
  }

  ctx.response.type = "application/json; charset=utf-8";
  
  console.log("Sending email...");

  try {

    await sendSmtpEmail({
      from: body.from,
      to: body.to,
      subject: body.subject,
      content: "yada yada yada...",
      html: body.body,
    });

  } catch(err) {

    console.error(err);
    return ctx.response.body = { success: false, error: err.message };

  }

  return ctx.response.body = { success: true };
}

const router = new Router();
router
  .get("/", (ctx: Context) => {
    ctx.response.type = "application/json; charset=utf-8";
    return ctx.response.body = { author: "Bruno Cabrita", url: "https://cabrita.link" };
  })
  .post("/send-email", sendEmailRequest);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port:8001});