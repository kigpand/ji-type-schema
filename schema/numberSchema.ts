import { ISchema } from "../interface/ISchema";

export class NumberSchema implements ISchema<number> {
  parse(input: unknown): number {
    if (typeof input !== "number") {
      throw new Error("Expected number");
    }
    return input;
  }

  safeParse(
    input: unknown
  ): { success: false; errors: string[] } | { success: true; data: number } {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        errors: [e instanceof Error ? e.message : "Unknown error"],
      };
    }
  }
}
