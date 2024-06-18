CREATE TABLE IF NOT EXISTS "events" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text DEFAULT 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
	"date" date NOT NULL,
	"location" text NOT NULL,
	"token" text NOT NULL,
	"verified" boolean DEFAULT false,
	"coordinates" json DEFAULT '{"lat":0,"lng":0}'::json NOT NULL,
	"link" text,
	"organizer" uuid NOT NULL,
	"attendees" json DEFAULT '{"userId":"","code":""}'::json,
	"attendeesCount" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "events_title_index" ON "events"("title");
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_organizer_users__id_fk" FOREIGN KEY ("organizer") REFERENCES "public"."users"("_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
