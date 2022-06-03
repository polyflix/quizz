import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { UserEntity } from "./user.entity";

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

  @Column("uuid")
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.userId, {
    eager: true
  })
  @JoinColumn({ name: "userId" })
  user?: UserEntity;
}
