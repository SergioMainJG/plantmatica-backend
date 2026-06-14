/**
 * @description Errors about typing issues. Just like don't satisfy requirements
 */
export class TypeNotSatisfiedError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, TypeNotSatisfiedError.prototype);
  }
}
