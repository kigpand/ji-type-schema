import { BaseSchema } from "../BaseSchema";

export class BooleanSchema extends BaseSchema<boolean> {
  parse(input: unknown): boolean {
    if (typeof input !== "boolean") {
      throw new Error("Expect boolean");
    }
    return input;
  }
}
