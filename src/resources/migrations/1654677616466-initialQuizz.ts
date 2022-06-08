import {MigrationInterface, QueryRunner} from "typeorm";

export class initialQuizz1654677616466 implements MigrationInterface {
    name = 'initialQuizz1654677616466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userId" character varying NOT NULL, "avatar" text NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TYPE "public"."quizz_visibility_enum" AS ENUM('public', 'protected', 'private')`);
        await queryRunner.query(`CREATE TABLE "quizz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "keepHighestScore" boolean NOT NULL DEFAULT false, "allowedRetries" integer NOT NULL DEFAULT '1', "draft" boolean NOT NULL DEFAULT false, "visibility" "public"."quizz_visibility_enum" NOT NULL DEFAULT 'public', "userId" character varying NOT NULL, CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "index" integer NOT NULL, "label" character varying NOT NULL, "quizzId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternative" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "label" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "questionId" uuid, CONSTRAINT "PK_93e717011957def707e61de0723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "score" double precision NOT NULL, "answers" json NOT NULL, "quizzId" uuid NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_da18915d951aa8d53f4a765f1b3" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alternative" ADD CONSTRAINT "FK_987e598dc6447a20fa182141434" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_dd8844876037b478f5bb859512e" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_dd8844876037b478f5bb859512e"`);
        await queryRunner.query(`ALTER TABLE "alternative" DROP CONSTRAINT "FK_987e598dc6447a20fa182141434"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_da18915d951aa8d53f4a765f1b3"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
        await queryRunner.query(`DROP TABLE "alternative"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
        await queryRunner.query(`DROP TYPE "public"."quizz_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
