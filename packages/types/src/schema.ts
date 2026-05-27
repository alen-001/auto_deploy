import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const deployments = pgTable("deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  repoUrl: varchar("repo_url", { length: 256 }).notNull(),
  branch: varchar("branch", { length: 256 }).notNull().default("main"),
  outDir: varchar("out_dir", { length: 256 }).notNull().default("dist"),
  buildCommand: varchar("build_command", { length: 256 }).notNull(),
//   commitSha: varchar("commit_sha", { length: 256 }).notNull(),
  callbackUrl: varchar("callback_url", { length: 256 }),
  status: varchar("status", { length: 50 }).notNull().default("queued"), // queued, building, success, failed
  logs: text("logs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});