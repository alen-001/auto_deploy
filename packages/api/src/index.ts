import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Queue } from "bullmq";
import crypto from "crypto";
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
const deployQueue = new Queue("deploy");
app.post("/deploy", async (c) => {
  const {
    repo_url,
    branch,
    build_command = "npm run build",
    commit_sha,
    callback_url,
  } = await c.req.json();
  const deployId = crypto.randomUUID();
  console.log(
    `Received deploy request: repo_url=${repo_url}, branch=${branch}, commit_sha=${commit_sha}, callback_url=${callback_url}, user_agent=${c.req.header("user-agent")}`,
  );
  await deployQueue.add("deploy", {
    repo_url,
    branch,
    build_command,
    commit_sha,
    callback_url,
    deployId,
  });
  return c.json({ deployId, status: "queued" });
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
