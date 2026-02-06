export type Path = (string | number)[];

export type ValidationError = {
  path?: Path;
  message: string;
};

export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export interface ISchema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): SafeParseResult<T>;
}

export type Infer<T extends ISchema<any>> = T extends ISchema<infer U>
  ? U
  : never;
