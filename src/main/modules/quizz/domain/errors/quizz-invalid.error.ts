export class QuizzInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The quizz is invalid.`);
  }
}
