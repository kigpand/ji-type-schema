import { BaseSchema } from "../BaseSchema";

export class NumberSchema extends BaseSchema<number> {
  parse(input: unknown): number {
    if (typeof input !== "number") {
      throw this.makeError("Expected number", [], "invalid_type");
    }
    return input;
  }
}
