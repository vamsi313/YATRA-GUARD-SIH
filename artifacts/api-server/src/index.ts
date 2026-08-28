import fs from "node:fs";
import path from "node:path";
import app from "./app";
import { logger } from "./lib/logger";

// Auto load .env if not present in process.env
if (!process.env.DATABASE_URL) {
  try {
    const envPaths = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "artifacts/api-server/.env"),
      path.resolve(__dirname, "../../.env"),
      path.resolve(__dirname, ".env"),
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

const rawPort = process.env["PORT"] || "5000";

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
