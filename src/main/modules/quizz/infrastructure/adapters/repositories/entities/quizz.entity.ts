import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { QuestionEntity } from "./question.entity";
import { UserEntity } from "./user.entity";

export enum Visibility {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private"
}
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

  @Column({ enum: Visibility, type: "enum", default: Visibility.PUBLIC })
  visibility?: Visibility;

  @Column("uuid")
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.userId, {
    eager: true
  })
  @JoinColumn({ name: "userId" })
  user?: UserEntity;

  questions_count?: number;
}
