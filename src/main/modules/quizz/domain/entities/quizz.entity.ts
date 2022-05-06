import { Question } from "./question.entity";
import { Default } from "./default.entity";
import { QuizzInvalidError } from "../errors/quizz-invalid.error";
import { Result } from "@swan-io/boxed";

export class QuizzProps extends Default {
  name: string;
  keepHighestScore: boolean;
  allowedRetries: number;
  questions: Question[];
  userId: string;
  draft: boolean;
}

export class Quizz {
  private constructor(
    public name: string,
    public keepHighestScore: boolean,
    public allowedRetries: number,
    public questions: Question[],
    public userId: string,
    public draft: boolean = false,
    public id?: string
  ) {}

  static create(props: QuizzProps): Quizz {
    const quizz = new Quizz(
      props.name,
      props.keepHighestScore,
      props.allowedRetries,
      props.questions,
      props.userId,
      props.draft
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
