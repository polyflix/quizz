import { MigrationInterface, QueryRunner } from "typeorm";

export class AttemptsUser1654273947419 implements MigrationInterface {
  name = "AttemptsUser1654273947419";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP COLUMN "user_firstName"`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP COLUMN "user_lastName"`
    );
    await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "user_avatar"`);
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "userId" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_dd8844876037b478f5bb859512e" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP CONSTRAINT "FK_dd8844876037b478f5bb859512e"`
    );
    await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_avatar" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_lastName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_firstName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "user_id" character varying NOT NULL`
    );
  }
}
