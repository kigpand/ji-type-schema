import { BaseSchema } from "../BaseSchema";

export class NumberSchema extends BaseSchema<number> {
  parse(input: unknown): number {
    if (typeof input !== "number") {
      throw new Error("Expected number");
    }
    return input;
  }
}
