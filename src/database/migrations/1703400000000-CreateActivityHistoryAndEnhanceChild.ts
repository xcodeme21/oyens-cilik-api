import { MigrationInterface, QueryRunner, Table, TableIndex, TableUnique } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateActivityHistoryAndEnhanceChild1703400000000
  implements MigrationInterface
{
  name = 'CreateActivityHistoryAndEnhanceChild1703400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create activity_history table
    await queryRunner.createTable(
      new Table({
        name: 'activity_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'childId',
            type: 'uuid',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'lessonsCompleted',
            type: 'int',
            default: 0,
          },
          {
            name: 'starsEarned',
            type: 'int',
            default: 0,
          },
          {
            name: 'minutesPlayed',
            type: 'int',
            default: 0,
          },
          {
            name: 'lettersLearned',
            type: 'int',
            default: 0,
          },
          {
            name: 'numbersLearned',
            type: 'int',
            default: 0,
          },
          {
            name: 'animalsLearned',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['childId'],
            referencedTableName: 'children',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Add unique constraint for childId + date
    await queryRunner.createUniqueConstraint(
      'activity_history',
      new TableUnique({
        name: 'UQ_activity_history_child_date',
        columnNames: ['childId', 'date'],
      }),
    );

    // Create index for faster lookups
    await queryRunner.createIndex(
      'activity_history',
      new TableIndex({
        name: 'IDX_activity_history_childId_date',
        columnNames: ['childId', 'date'],
      }),
    );

    // Add totalLessonsCompleted to children table
    await queryRunner.query(`
      ALTER TABLE "children"
      ADD COLUMN IF NOT EXISTS "totalLessonsCompleted" int DEFAULT 0
    `);

    // Add favoriteModule to children table
    await queryRunner.query(`
      ALTER TABLE "children"
      ADD COLUMN IF NOT EXISTS "favoriteModule" varchar(20) DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns from children
    await queryRunner.query(`
      ALTER TABLE "children"
      DROP COLUMN IF EXISTS "totalLessonsCompleted"
    `);
    await queryRunner.query(`
      ALTER TABLE "children"
      DROP COLUMN IF EXISTS "favoriteModule"
    `);

    // Drop activity_history table
    await queryRunner.dropTable('activity_history', true);
  }
}
