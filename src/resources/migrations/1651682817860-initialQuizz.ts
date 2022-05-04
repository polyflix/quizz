import {MigrationInterface, QueryRunner} from "typeorm";

export class initialQuizz1651682817860 implements MigrationInterface {
    name = 'initialQuizz1651682817860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quizz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "keepHighestScore" boolean NOT NULL DEFAULT false, "allowedRetries" integer NOT NULL DEFAULT '1', "userId" character varying NOT NULL, CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "index" integer NOT NULL, "label" character varying NOT NULL, "quizzId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternative" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "label" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "questionId" uuid, CONSTRAINT "PK_93e717011957def707e61de0723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "score" double precision NOT NULL, "answers" json NOT NULL, "userId" character varying NOT NULL, "quizzId" uuid NOT NULL, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alternative" ADD CONSTRAINT "FK_987e598dc6447a20fa182141434" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alternative" DROP CONSTRAINT "FK_987e598dc6447a20fa182141434"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
        await queryRunner.query(`DROP TABLE "alternative"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
    }

}
