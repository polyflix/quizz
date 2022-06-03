import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDraftForQuizz1654254057409 implements MigrationInterface {
  name = "AddDraftForQuizz1654254057409";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizz" ADD "draft" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "draft"`);
  }
}
