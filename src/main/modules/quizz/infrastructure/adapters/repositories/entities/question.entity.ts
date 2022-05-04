import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested
} from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AlternativeEntity } from "./alternative.entity";
import { DefaultEntity } from "./default.entity";
import { QuizzEntity } from "./quizz.entity";

@Entity()
export class QuestionEntity extends DefaultEntity {
  @IsInt()
  @Min(0)
  @Column()
  index: number;

  @IsString()
  @Column()
  label: string;

  @IsArray()
  @ArrayNotEmpty({ always: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ValidateNested()
  @OneToMany(() => AlternativeEntity, (alt) => alt.question, {
    cascade: true
  })
  alternatives: AlternativeEntity[];

  @ManyToOne(() => QuizzEntity, (quizz) => quizz.questions, {
    onDelete: "CASCADE"
  })
  quizz?: QuizzEntity;
}
