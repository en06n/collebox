CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"work" text,
	"character_names" text,
	"category" text,
	"medium" text,
	"quantity" integer DEFAULT 0 NOT NULL,
	"target_quantity" integer,
	"release_year" integer,
	"images" text,
	"external_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
