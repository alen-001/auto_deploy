import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.post("/deploy", async (c) => {
  const { repo_url, branch, commit_sha, callback_url } = await c.req.json();
  console.log(
    `Received deploy request: repo_url=${repo_url}, branch=${branch}, commit_sha=${commit_sha}, callback_url=${callback_url}`,
  );
  return c.text("Deploy request received");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
