import { BaseSchema } from "../BaseSchema";

// Number 스키마: 입력이 숫자인지 검증.
export class NumberSchema extends BaseSchema<number> {
  // 숫자를 반환하거나 에러를 던짐.
  parse(input: unknown): number {
    if (typeof input !== "number") {
      throw this.makeError("Expected number", [], "invalid_type");
    }
    return input;
  }
}
