import { text, pgTable, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const postsTable = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  author: text("author").notNull(),
  author_id: text("author_id").notNull(),
  user_image_url: text("user_image_url").notNull(),
  likes: jsonb("likes")
    .$type<{ author_id: string; post_id: string }[]>()
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  slug: text("slug").notNull(),
});

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  user_name: text("user_name").notNull(),
  user_id: text("user_id").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
