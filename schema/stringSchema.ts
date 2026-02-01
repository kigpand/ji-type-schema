import { ISchema, SafeParseResult } from "../interface/ISchema";

export class StringSchema implements ISchema<string> {
  parse(input: unknown): string {
    if (typeof input !== "string") {
      throw new Error("Expected string");
    }
    return input;
  }

  safeParse(input: unknown): SafeParseResult<string> {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        errors: [
          {
            message: e instanceof Error ? e.message : "Invalid string",
          },
        ],
      };
    }
  }
}
