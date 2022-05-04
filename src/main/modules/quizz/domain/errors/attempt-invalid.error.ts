export class AttemptInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The attempt is invalid.`);
  }
}
