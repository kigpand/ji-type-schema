import { BaseSchema } from "../BaseSchema";

// Boolean 스키마: 입력이 불리언인지 검증.
export class BooleanSchema extends BaseSchema<boolean> {
  // 불리언을 반환하거나 에러를 던짐.
  parse(input: unknown): boolean {
    if (typeof input !== "boolean") {
      throw this.makeError("Expected boolean", [], "invalid_type");
    }
    return input;
  }
}
