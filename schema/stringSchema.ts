import { BaseSchema } from "../BaseSchema";

// String 스키마: 입력이 문자열인지 검증.
export class StringSchema extends BaseSchema<string> {
  // 문자열을 반환하거나 에러를 던짐.
  parse(input: unknown): string {
    if (typeof input !== "string") {
      throw this.makeError("Expected string", [], "invalid_type");
    }
    return input;
  }
}
