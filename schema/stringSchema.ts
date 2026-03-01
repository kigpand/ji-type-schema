import { BaseSchema } from "../BaseSchema";

export class StringSchema extends BaseSchema<string> {
  parse(input: unknown): string {
    if (typeof input !== "string") {
      throw this.makeError("Expected string", [], "invalid_type");
    }
    return input;
  }
}
