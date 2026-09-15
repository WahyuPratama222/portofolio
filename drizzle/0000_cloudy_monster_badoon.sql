CREATE TYPE "public"."location_type" AS ENUM('remote', 'onsite', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
CREATE TABLE "certificate_tags" (
	"certificate_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "certificate_tags_certificate_id_tag_id_pk" PRIMARY KEY("certificate_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"preview_image" text,
	"is_winner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"points" text[] NOT NULL,
	"location_type" "location_type" NOT NULL,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"project_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "project_tags_project_id_tag_id_pk" PRIMARY KEY("project_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"problem_solved" text,
	"status" "status" DEFAULT 'ongoing' NOT NULL,
	"role" text[] NOT NULL,
	"preview_image" text,
	"github_url" text,
	"web_url" text,
	"github_visibility" "visibility" DEFAULT 'public' NOT NULL,
	"web_visibility" "visibility" DEFAULT 'public' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "certificate_tags" ADD CONSTRAINT "certificate_tags_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_tags" ADD CONSTRAINT "certificate_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;