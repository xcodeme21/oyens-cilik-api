import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateAdminUsersTable1703350000000 implements MigrationInterface {
  name = 'CreateAdminUsersTable1703350000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create admin_users table
    await queryRunner.query(`
      CREATE TYPE "admin_role_enum" AS ENUM('super_admin', 'admin')
    `);

    await queryRunner.query(`
      CREATE TABLE "admin_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" "admin_role_enum" NOT NULL DEFAULT 'admin',
        "isActive" boolean NOT NULL DEFAULT true,
        "refreshToken" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_admin_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_admin_users" PRIMARY KEY ("id")
      )
    `);

    // Create default super admin user
    const hashedPassword = await bcrypt.hash('yui678', 10);
    await queryRunner.query(`
      INSERT INTO "admin_users" ("name", "email", "password", "role")
      VALUES ('Super Admin', 'xcodeme21@gmail.com', $1, 'super_admin')
    `, [hashedPassword]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_users"`);
    await queryRunner.query(`DROP TYPE "admin_role_enum"`);
  }
}
