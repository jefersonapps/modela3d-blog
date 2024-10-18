import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { commentsTable, postsTable, usersTable } from "./schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.NEON_DATABASE_URL!);

export const db = drizzle(sql, {
  schema: { postsTable, usersTable, commentsTable },
});
