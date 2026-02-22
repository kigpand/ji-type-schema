import { BaseSchema } from "../BaseSchema";

export class BooleanSchema extends BaseSchema<boolean> {
  parse(input: unknown): boolean {
    if (typeof input !== "boolean") {
      throw this.makeError("Expected boolean", [], "invalid_type");
    }
    return input;
  }
}
