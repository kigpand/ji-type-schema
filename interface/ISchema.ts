export type ValidationError = {
  path?: string;
  message: string;
};

export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export interface ISchema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): SafeParseResult<T>;
}
