import { IsBoolean, IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { QuestionEntity } from "./question.entity";

@Entity()
export class AlternativeEntity extends DefaultEntity {
  @IsString()
  @Column()
  label: string;

  @IsBoolean()
  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne(() => QuestionEntity, (question) => question.alternatives, {
    onDelete: "CASCADE"
  })
  question?: QuestionEntity;
}
