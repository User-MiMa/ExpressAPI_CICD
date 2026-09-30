-- Custom SQL migration file, put your code below! --
UPDATE "subscribers" SET "email_adress" = "email" WHERE "email_adress" IS NULL;