import {
  text,
  pgTable,
  timestamp,
  jsonb,
  foreignKey,
} from "drizzle-orm/pg-core";
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

export const commentsTable = pgTable(
  "comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    post_id: text("post_id").notNull(),
    parent_comment_id: text("parent_comment_id"),
    parent_comment_author: text("parent_comment_author"),
    parent_comment_author_id: text("parent_comment_author_id"),
    content: text("content").notNull(),
    author: text("author").notNull(),
    author_id: text("author_id").notNull(),
    user_image_url: text("user_image_url"),
    likes: jsonb("likes")
      .$type<{ author_id: string; comment_id: string }[]>()
      .notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (commentsTable) => ({
    parentCommentForeignKey: foreignKey({
      columns: [commentsTable.parent_comment_id],
      foreignColumns: [commentsTable.id],
    }).onDelete("cascade"),
  })
);
