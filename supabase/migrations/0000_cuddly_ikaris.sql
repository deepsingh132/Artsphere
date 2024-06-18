CREATE TABLE IF NOT EXISTS "posts" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text DEFAULT '',
	"authorID" uuid NOT NULL,
	"category" text DEFAULT 'other',
	"featured" boolean DEFAULT false,
	"likes" uuid[] DEFAULT ,
	"comments" json[] DEFAULT ,
	"url" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"image" text DEFAULT 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
	"bio" text DEFAULT 'We dont know much about this user yet, but we are sure they are artistic!',
	"followers" text[] DEFAULT ,
	"following" text[] DEFAULT ,
	"verified" boolean DEFAULT false,
	"role" text DEFAULT 'user',
	"likes" text[] DEFAULT ,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_authorID_users_id_fk" FOREIGN KEY ("authorID") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
