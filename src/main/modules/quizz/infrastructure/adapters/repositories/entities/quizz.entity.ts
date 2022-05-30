import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { QuestionEntity } from "./question.entity";

@Entity("quizz")
export class QuizzEntity extends DefaultEntity {
  @Column()
  name: string;

  @Column({ default: false })
  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  keepHighestScore: boolean;

  @Column({ default: 1 })
  @IsOptional({ always: true })
  allowedRetries: number;

  @OneToMany(() => QuestionEntity, (question) => question.quizz, {
    cascade: true
  })
  @Type(() => QuestionEntity)
  questions: QuestionEntity[];

  @Column({ default: false })
  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  draft: boolean;

  @IsString()
  @Column()
  user_id: string;

  @IsString()
  @Column()
  user_firstName: string;

  @IsString()
  @Column()
  user_lastName: string;

  @IsString()
  @Column()
  user_avatar: string;
}
