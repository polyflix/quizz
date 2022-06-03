import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFlatUser1653290637472 implements MigrationInterface {
  name = "AddFlatUser1653290637472";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "quizz" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "quizz" ADD "user_firstName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "quizz" ADD "user_lastName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "quizz" ADD "user_avatar" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_firstName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_lastName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_avatar" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_avatar"`);
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_lastName"`);
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_firstName"`);
    await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "quizz" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP COLUMN "user_lastName"`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP COLUMN "user_firstName"`
    );
    await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "userId" character varying NOT NULL`
    );
  }
}
