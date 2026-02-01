import { BaseSchema } from "../BaseSchema";

export class StringSchema extends BaseSchema<string> {
  parse(input: unknown): string {
    if (typeof input !== "string") {
      throw new Error("Expected string");
    }
    return input;
  }
}
