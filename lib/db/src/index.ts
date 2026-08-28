import fs from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Auto load .env if not set
if (!process.env.DATABASE_URL) {
  try {
    const envPaths = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "artifacts/api-server/.env"),
      path.resolve(process.cwd(), "../../.env"),
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        for (const line of content.split("\n")) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match && !process.env[match[1]]) {
            process.env[match[1]] = match[2]?.trim().replace(/^['"]|['"]$/g, "");
          }
        }
      }
    }
  } catch {}
}

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_M8B4bOiwFgkz@ep-muddy-breeze-axm5jctb-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });

export * from "./schema";
