import { Result } from "@swan-io/boxed";
import { AttemptInvalidError } from "../errors/attempt-invalid.error";
import { Default } from "./default.model";
import { User } from "./user.model";

export interface QuizzAnswers {
  [questionId: string]: string[];
}
export class AttemptProps extends Default {
  score: number;
  answers: QuizzAnswers;
  user: User;
  quizzId: string;
}

export class Attempt {
  private constructor(
    public score: number,
    public answers: QuizzAnswers,
    public user: User,
    public quizzId: string,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: AttemptProps): Attempt {
    const attempt = new Attempt(
      props.score,
      props.answers,
      props.user,
      props.quizzId,
      props.id,
      props.createdAt ? new Date(props.createdAt) : undefined,
      props.updatedAt ? new Date(props.updatedAt) : undefined
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
