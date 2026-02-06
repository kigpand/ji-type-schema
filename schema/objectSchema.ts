import { BaseSchema } from "../BaseSchema";
import { Infer, ISchema, ValidationError } from "../interface/ISchema";

export class ObjectSchema<
  TShape extends Record<string, ISchema<any>>
> extends BaseSchema<{ [K in keyof TShape]: Infer<TShape[K]> }> {
  constructor(private readonly shape: TShape) {
    super();
  }

  parse(input: unknown) {
    if (typeof input !== "object" || input === null) {
      throw new Error("Expected object");
    }

    const result: any = {};
    const errors: ValidationError[] = [];

    for (const key in this.shape) {
      const schema = this.shape[key];
      const value = (input as any)[key];

      const parsed = schema.safeParse(value);

      if (!parsed.success) {
        parsed.errors.forEach((err) => {
          errors.push({
            path: [key, ...(err.path ?? [])],
            message: err.message,
          });
        });
      } else {
        result[key] = parsed.data;
      }
    }

    if (errors.length > 0) {
      const error = new Error("Object validation failed");
      (error as any).errors = errors;
      throw error;
    }

    return result;
  }
}
