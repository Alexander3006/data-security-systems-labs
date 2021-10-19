CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "active" bool NOT NULL DEFAULT true,
    "bad_attempts" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Logging" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "type" varchar NOT NULL,
    "message" text,
    "grade" INT DEFAULT 0,
    "user_id" INTEGER REFERENCES "User"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE  TABLE IF NOT EXISTS  "Question" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER REFERENCES "User"("id"),
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);