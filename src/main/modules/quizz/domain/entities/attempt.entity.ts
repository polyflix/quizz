import { Result } from "@swan-io/boxed";
import { AttemptInvalidError } from "../errors/attempt-invalid.error";
import { Default } from "./default.entity";

export interface QuizzAnswers {
  [questionId: string]: string[];
}
export class AttemptProps extends Default {
  score: number;
  answers: QuizzAnswers;
  userId: string;
  quizzId: string;
}

export class Attempt {
  private constructor(
    public score: number,
    public answers: QuizzAnswers,
    public userId: string,
    public quizzId: string,
    public id?: string
  ) {}

  static create(props: AttemptProps): Attempt {
    const attempt = new Attempt(
      props.score,
      props.answers,
      props.userId,
      props.quizzId
    );

    return attempt.validate().match({
      Ok: () => attempt,
      Error: (e) => {
        throw new AttemptInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Model valid");
  }
}
