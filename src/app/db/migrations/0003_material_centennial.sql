CREATE TABLE IF NOT EXISTS "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"parent_comment_id" text,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"author_id" text NOT NULL,
	"user_image_url" text,
	"likes" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
