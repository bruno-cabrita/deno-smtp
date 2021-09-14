import { Application } from "https://deno.land/x/oak/mod.ts";
// import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

const smtp = {
  host: Deno.env.get("SMTP_HOST"),
  port: Deno.env.get("SMTP_PORT"),
  user: Deno.env.get("SMTP_USER"),
  pass: Deno.env.get("SMTP_PASS"),
};

const token = Deno.env.get("REQUEST_TOKEN");

// const client = new SmtpClient();

// await client.connect({
//   hostname: "smtp.163.com",
//   port: 25,
//   username: "username",
//   password: "password",
// });

// await client.send({
//   from: "mailaddress@163.com",
//   to: "to-address@xx.com",
//   subject: "Mail Title",
//   content: "Mail Content",
//   html: "<a href='https://github.com'>Github</a>",
// });

// await client.close();

const app = new Application();

app.use((ctx) => {
  ctx.response.body = `Hello, world! ${token}`;
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

await app.listen({port:8001});