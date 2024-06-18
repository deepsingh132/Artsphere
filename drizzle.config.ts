import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./models/*",
  out: "./supabase/migrations",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
}) satisfies Config;