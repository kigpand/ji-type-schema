import { ISchema, Path, SafeParseResult, ValidationError } from "./interface/ISchema";

// 모든 스키마의 베이스: safeParse, 타입 가드, 공통 헬퍼 제공.
export abstract class BaseSchema<T> implements ISchema<T> {
  abstract parse(input: unknown): T;

  // 어떤 에러든 일관된 ValidationError 목록으로 정규화.
  protected normalizeError(e: unknown): ValidationError[] {
    if (Array.isArray(e)) {
      return e.map((err) => this.normalizeIssue(err));
    }

    if (e && typeof e === "object" && Array.isArray((e as any).errors)) {
      return (e as any).errors.map((err: unknown) => this.normalizeIssue(err));
    }

    if (e instanceof Error) {
      return [this.issue(e.message)];
    }

    return [this.issue("Invalid value")];
  }

  // 안전 파싱: throw 없이 success 또는 errors 반환.
  safeParse(input: unknown): SafeParseResult<T> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (e) {
      return {
        success: false,
        errors: this.normalizeError(e),
      };
    }
  }

  // 런타임 검증 기반 타입 가드.
  is(input: unknown): input is T {
    return this.safeParse(input).success;
  }

  // 검증 실패 시 throw, 성공 시 타입을 좁힘.
  assert(input: unknown): asserts input is T {
    const result = this.safeParse(input);
    if (!result.success) {
      const error = new Error("Validation failed");
      (error as any).errors = result.errors;
      throw error;
    }
  }

  // undefined 허용.
  optional(): ISchema<T | undefined> {
    return new OptionalSchema(this);
  }

  // null 허용.
  nullable(): ISchema<T | null> {
    return new NullableSchema(this);
  }

  // 커스텀 검증 규칙 추가.
  refine(check: (value: T) => boolean, message = "Invalid value", code = "custom"): ISchema<T> {
    return new RefineSchema(this, check, message, code);
  }

  // path, code를 포함한 ValidationError 생성.
  protected issue(message: string, path: Path = [], code = "custom"): ValidationError {
    return { message, path, code };
  }

  // ValidationError[]를 담는 Error 생성(후속 정규화를 위함).
  protected makeError(message: string, path: Path = [], code = "custom"): Error {
    const error = new Error(message);
    (error as any).errors = [this.issue(message, path, code)];
    return error;
  }

  // 단일 에러 형태를 ValidationError로 정규화.
  private normalizeIssue(err: unknown): ValidationError {
    if (!err || typeof err !== "object") {
      return this.issue("Invalid value");
    }

    const message = typeof (err as any).message === "string" ? (err as any).message : "Invalid value";
    const path = Array.isArray((err as any).path) ? ((err as any).path as Path) : [];
    const code = typeof (err as any).code === "string" ? (err as any).code : "custom";

    return { message, path, code };
  }
}

// Optional 래퍼: undefined는 통과, 그 외는 내부 스키마로 위임.
class OptionalSchema<T> extends BaseSchema<T | undefined> {
  constructor(private readonly inner: ISchema<T>) {
    super();
  }

  parse(input: unknown): T | undefined {
    if (input === undefined) {
      return undefined;
    }

    return this.inner.parse(input);
  }
}

// Nullable 래퍼: null은 통과, 그 외는 내부 스키마로 위임.
class NullableSchema<T> extends BaseSchema<T | null> {
  constructor(private readonly inner: ISchema<T>) {
    super();
  }

  parse(input: unknown): T | null {
    if (input === null) {
      return null;
    }

    return this.inner.parse(input);
  }
}

// Refine 래퍼: 내부 parse 후 커스텀 검증 실행.
class RefineSchema<T> extends BaseSchema<T> {
  constructor(
    private readonly inner: ISchema<T>,
    private readonly check: (value: T) => boolean,
    private readonly message: string,
    private readonly code: string
  ) {
    super();
  }

  parse(input: unknown): T {
    const value = this.inner.parse(input);
    if (!this.check(value)) {
      throw this.makeError(this.message, [], this.code);
    }
    return value;
  }
}
