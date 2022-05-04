import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { DefaultEntity } from "./default.entity";

export interface QuizzAnswersEntity {
  [questionId: string]: string[];
}

@Entity()
export class AttemptEntity extends DefaultEntity {
  @Column({ type: "float" })
  score: number;

  @Column({ type: "json" })
  answers: QuizzAnswersEntity;

  @Column()
  userId: string;

  @Column("uuid")
  @Exclude()
  quizzId?: string;
}
