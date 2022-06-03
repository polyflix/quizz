import { Question } from "./question.model";
import { Default } from "./default.model";
import { QuizzInvalidError } from "../errors/quizz-invalid.error";
import { Result } from "@swan-io/boxed";
import { User } from "./user.model";
import { Visibility } from "../../infrastructure/adapters/repositories/entities/quizz.entity";

export class QuizzProps extends Default {
  name: string;
  keepHighestScore: boolean;
  allowedRetries: number;
  questions: Question[];
  user: User;
  draft: boolean;
  visibility: Visibility;
}

export class Quizz {
  private constructor(
    public name: string,
    public data: {
      keepHighestScore: boolean;
      allowedRetries: number;
      questions: Question[];
    },
    public user: User,
    public draft: boolean = false,
    public visibility: Visibility,
    public id: string,
    public createdAt: Date,
    public updatedAt: Date,
    public __v: number,
    public type: string = "quizz"
  ) {}

  static create(props: QuizzProps): Quizz {
    const quizz = new Quizz(
      props.name,
      {
        keepHighestScore: props.keepHighestScore,
        allowedRetries: props.allowedRetries,
        questions: props.questions
      },
      props.user,
      props.draft,
      props.visibility,
      props.id,
      props.createdAt,
      props.updatedAt,
      props.__v
    );

    return quizz.validate().match({
      Ok: () => quizz,
      Error: (e) => {
        throw new QuizzInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Model valid");
  }
}
