import { ISchema, Path, SafeParseResult, ValidationError } from "./interface/ISchema";

export abstract class BaseSchema<T> implements ISchema<T> {
  abstract parse(input: unknown): T;

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

  is(input: unknown): input is T {
    return this.safeParse(input).success;
  }

  assert(input: unknown): asserts input is T {
    const result = this.safeParse(input);
    if (!result.success) {
      const error = new Error("Validation failed");
      (error as any).errors = result.errors;
      throw error;
    }
  }

  optional(): ISchema<T | undefined> {
    return new OptionalSchema(this);
  }

  nullable(): ISchema<T | null> {
    return new NullableSchema(this);
  }

  refine(check: (value: T) => boolean, message = "Invalid value", code = "custom"): ISchema<T> {
    return new RefineSchema(this, check, message, code);
  }

  protected issue(message: string, path: Path = [], code = "custom"): ValidationError {
    return { message, path, code };
  }

  protected makeError(message: string, path: Path = [], code = "custom"): Error {
    const error = new Error(message);
    (error as any).errors = [this.issue(message, path, code)];
    return error;
  }

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
