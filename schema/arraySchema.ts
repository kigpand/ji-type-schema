import { BaseSchema } from "../BaseSchema";
import { ISchema, ValidationError } from "../interface/ISchema";

export class ArraySchema<T> extends BaseSchema<T[]> {
  constructor(private readonly item: ISchema<T>) {
    super();
  }

  parse(input: unknown): T[] {
    if (!Array.isArray(input)) {
      throw this.makeError("Expected array", [], "invalid_type");
    }

    const result: T[] = [];
    const errors: ValidationError[] = [];

    for (let index = 0; index < input.length; index += 1) {
      const parsed = this.item.safeParse(input[index]);
      if (!parsed.success) {
        parsed.errors.forEach((err) => {
          errors.push({
            path: [index, ...err.path],
            message: err.message,
            code: err.code,
          });
        });
      } else {
        result.push(parsed.data);
      }
    }

    if (errors.length > 0) {
      const error = new Error("Array validation failed");
      (error as any).errors = errors;
      throw error;
    }

    return result;
  }
}
