import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1703253600000 implements MigrationInterface {
  name = 'InitialSchema1703253600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "public"."auth_provider_enum" AS ENUM ('local', 'google')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."gender_enum" AS ENUM ('male', 'female')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."content_type_enum" AS ENUM ('letter', 'number', 'animal')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."activity_type_enum" AS ENUM ('learn', 'quiz', 'game')
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255),
        "phone" character varying(20),
        "avatarUrl" character varying(500),
        "authProvider" "public"."auth_provider_enum" NOT NULL DEFAULT 'local',
        "googleId" character varying(255),
        "refreshToken" character varying(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create children table
    await queryRunner.query(`
      CREATE TABLE "children" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "nickname" character varying(50),
        "birthDate" date,
        "gender" "public"."gender_enum",
        "avatarUrl" character varying(500),
        "level" integer NOT NULL DEFAULT 1,
        "totalStars" integer NOT NULL DEFAULT 0,
        "streak" integer NOT NULL DEFAULT 0,
        "lastActiveDate" date,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "parentId" uuid,
        CONSTRAINT "PK_children" PRIMARY KEY ("id")
      )
    `);

    // Create letters table
    await queryRunner.query(`
      CREATE TABLE "letters" (
        "id" SERIAL NOT NULL,
        "letter" character(1) NOT NULL,
        "lowercase" character(1) NOT NULL,
        "audioUrl" character varying(500),
        "exampleWord" character varying(100) NOT NULL,
        "exampleImageUrl" character varying(500),
        "order" integer NOT NULL,
        CONSTRAINT "UQ_letters_letter" UNIQUE ("letter"),
        CONSTRAINT "PK_letters" PRIMARY KEY ("id")
      )
    `);

    // Create numbers table
    await queryRunner.query(`
      CREATE TABLE "numbers" (
        "id" SERIAL NOT NULL,
        "number" integer NOT NULL,
        "word" character varying(50) NOT NULL,
        "audioUrl" character varying(500),
        "imageUrl" character varying(500),
        "order" integer NOT NULL,
        CONSTRAINT "UQ_numbers_number" UNIQUE ("number"),
        CONSTRAINT "PK_numbers" PRIMARY KEY ("id")
      )
    `);

    // Create animals table
    await queryRunner.query(`
      CREATE TABLE "animals" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "nameEn" character varying(100) NOT NULL,
        "description" text NOT NULL,
        "funFact" text NOT NULL,
        "imageUrl" character varying(500),
        "audioUrl" character varying(500),
        "difficulty" character varying(20) NOT NULL DEFAULT 'easy',
        "order" integer NOT NULL,
        CONSTRAINT "PK_animals" PRIMARY KEY ("id")
      )
    `);

    // Create progress table
    await queryRunner.query(`
      CREATE TABLE "progress" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "childId" uuid NOT NULL,
        "contentType" "public"."content_type_enum" NOT NULL,
        "contentId" integer NOT NULL,
        "activityType" "public"."activity_type_enum" NOT NULL,
        "completed" boolean NOT NULL DEFAULT false,
        "score" integer NOT NULL DEFAULT 0,
        "starsEarned" integer NOT NULL DEFAULT 0,
        "attempts" integer NOT NULL DEFAULT 0,
        "timeSpentSeconds" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_progress" PRIMARY KEY ("id")
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "children" 
      ADD CONSTRAINT "FK_children_parent" 
      FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "progress" 
      ADD CONSTRAINT "FK_progress_child" 
      FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_children_parent" ON "children" ("parentId")`);
    await queryRunner.query(`CREATE INDEX "IDX_progress_child" ON "progress" ("childId")`);
    await queryRunner.query(`CREATE INDEX "IDX_progress_content" ON "progress" ("contentType", "contentId")`);

    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_progress_content"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_progress_child"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_children_parent"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);

    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_progress_child"`);
    await queryRunner.query(`ALTER TABLE "children" DROP CONSTRAINT "FK_children_parent"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "progress"`);
    await queryRunner.query(`DROP TABLE "animals"`);
    await queryRunner.query(`DROP TABLE "numbers"`);
    await queryRunner.query(`DROP TABLE "letters"`);
    await queryRunner.query(`DROP TABLE "children"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."activity_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."auth_provider_enum"`);
  }
}
