export type Path = (string | number)[];

export type ValidationError = {
  path: Path;
  message: string;
  code: string;
};

export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export interface ISchema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): SafeParseResult<T>;
  is(input: unknown): input is T;
  assert(input: unknown): asserts input is T;
  optional(): ISchema<T | undefined>;
  nullable(): ISchema<T | null>;
  refine(check: (value: T) => boolean, message?: string, code?: string): ISchema<T>;
}

/**
 * Infer는 ISchema<...>을 구현한 타입만 받을수 있다.
 * T extends ISchema<infer U> ? U : never 👉 T가 ISchema<...>의 형태라면 그 안의 타입을 U라고 추론해서 반환해라.
 * infer U 👉 타입 역추론. ex) ISchema<string> => U = string, ISchema<number> => U = number
 */
export type Infer<T extends ISchema<any>> = T extends ISchema<infer U>
  ? U
  : never;
