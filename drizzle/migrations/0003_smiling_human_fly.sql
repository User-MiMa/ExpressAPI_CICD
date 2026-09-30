ALTER TABLE "subscribers" ALTER COLUMN "email_adress" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_email_adress_unique" UNIQUE("email_adress");