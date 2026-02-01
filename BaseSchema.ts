import { ISchema, SafeParseResult } from "./interface/ISchema";

export abstract class BaseSchema<T> implements ISchema<T> {
  abstract parse(input: unknown): T;

  safeParse(input: unknown): SafeParseResult<T> {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        errors: [
          {
            message: e instanceof Error ? e.message : "Invalid value",
          },
        ],
      };
    }
  }
}
