import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1654262336281 implements MigrationInterface {
    name = 'AddUserTable1654262336281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userId" character varying NOT NULL, "avatar" text NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_firstName"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_lastName"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "user_avatar"`);
        await queryRunner.query(`CREATE TYPE "public"."quizz_visibility_enum" AS ENUM('public', 'protected', 'private')`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD "visibility" "public"."quizz_visibility_enum" NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_adb0b668e6f76ff4d94885483d5" FOREIGN KEY ("user_id") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_adb0b668e6f76ff4d94885483d5"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "visibility"`);
        await queryRunner.query(`DROP TYPE "public"."quizz_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD "user_avatar" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD "user_lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD "user_firstName" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
