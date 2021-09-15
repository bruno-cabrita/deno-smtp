import { Application, Router, Context } from "./deps.ts";
import { sendSmtpEmail } from "./smtp.ts"

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
  
  try {
    console.log("Sending email...");
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
    return ctx.response.body = {};
  })
  .get("/shield-deno", (ctx: Context) => {
    ctx.response.type = "application/json; charset=utf-8";
    return ctx.response.body = {
      schemaVersion: 1,
      label: "Deno",
      message: "v1.13.2",
      color: "orange",
      namedLogo: "deno",
    };
  })
  .post("/send-email", sendEmailRequest);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

export { app };