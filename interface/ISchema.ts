export interface ISchema<T> {
  parse(input: unknown): T;
  safeParse(
    input: unknown
  ): { success: true; data: T } | { success: false; errors: string[] };
}
