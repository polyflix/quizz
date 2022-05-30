import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import { DefaultEntity } from "./default.entity";

export interface QuizzAnswersEntity {
  [questionId: string]: string[];
}

@Entity("attempt")
export class AttemptEntity extends DefaultEntity {
  @Column({ type: "float" })
  score: number;

  @Column({ type: "json" })
  answers: QuizzAnswersEntity;

  @Column("uuid")
  @Exclude()
  quizzId?: string;

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
