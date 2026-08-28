import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_M8B4bOiwFgkz@ep-muddy-breeze-axm5jctb-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  schema: "./lib/db/src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
