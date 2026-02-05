import { ISchema, SafeParseResult, ValidationError } from "./interface/ISchema";

export abstract class BaseSchema<T> implements ISchema<T> {
  abstract parse(input: unknown): T;

  protected normalizeError(e: unknown): ValidationError[] {
    if (Array.isArray(e)) {
      return e;
    }

    if (e instanceof Error) {
      return [{ message: e.message }];
    }

    return [{ message: "Invalid value" }];
  }

  safeParse(input: unknown): SafeParseResult<T> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (e) {
      return {
        success: false,
        errors: this.normalizeError(e),
      };
    }
  }
}
