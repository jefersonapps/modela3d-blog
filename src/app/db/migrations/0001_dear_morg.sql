ALTER TABLE "posts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "user_image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "likes" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "title";