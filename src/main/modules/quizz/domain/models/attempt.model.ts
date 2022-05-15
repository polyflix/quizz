import { Result } from "@swan-io/boxed";
import { AttemptInvalidError } from "../errors/attempt-invalid.error";
import { Default } from "./default.model";
<<<<<<< HEAD:src/main/modules/quizz/domain/models/attempt.model.ts
import { User } from "./user.model";
=======
>>>>>>> 734dbbc (refactor(quizz): fixed integration issues with frontend):src/main/modules/quizz/domain/entities/attempt.entity.ts

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
    public id?: string
  ) {}

  static create(props: AttemptProps): Attempt {
    const attempt = new Attempt(
      props.score,
      props.answers,
      props.user,
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
