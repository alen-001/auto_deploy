import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Queue } from "bullmq";

const { db, deployments } = await import("@auto_deploy/types");
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
const deployQueue = new Queue("deploy");
app.post("/deploy", async (c) => {
  const {
    repo_url,
    branch,
    out_dir="./dist",
    build_command = "npm run build",
    callback_url,
  } = await c.req.json();
  
  const [deployment] = await db.insert(deployments).values({
    repoUrl: repo_url,
    branch,
    outDir: out_dir,
    buildCommand: build_command,
    callbackUrl: callback_url,
    status: "queued"
  }).returning({ deployId: deployments.id });

  const deployId = deployment.deployId;

  console.log(
    `Received deploy request: repo_url=${repo_url}, branch=${branch}, callback_url=${callback_url}, user_agent=${c.req.header("user-agent")}`,
  );
  await deployQueue.add("deploy", {
    repo_url,
    branch,
    build_command,
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
