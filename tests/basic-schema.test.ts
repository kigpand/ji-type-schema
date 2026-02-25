import { describe, expect, it } from "vitest";
import type { Infer } from "../index";
import {
  booleanSchema,
  flattenErrors,
  formatErrors,
  numberSchema,
  objectSchema,
  stringSchema,
  arraySchema,
} from "../index";

describe("basic schemas", () => {
  it("stringSchema parses valid string", () => {
    const schema = stringSchema();
    const result = schema.safeParse("hello");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("numberSchema rejects non-number", () => {
    const schema = numberSchema();
    const result = schema.safeParse("1");
    expect(result.success).toBe(false);
  });

  it("booleanSchema rejects non-boolean", () => {
    const schema = booleanSchema();
    const result = schema.safeParse("true");
    expect(result.success).toBe(false);
  });

  it("objectSchema parses nested schema", () => {
    const schema = objectSchema({
      name: stringSchema(),
      age: numberSchema(),
      active: booleanSchema(),
    });

    const result = schema.safeParse({
      name: "kim",
      age: 28,
      active: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "kim",
        age: 28,
        active: true,
      });
    }
  });

  it("objectSchema rejects invalid fields", () => {
    const schema = objectSchema({
      name: stringSchema(),
      age: numberSchema(),
    });

    const result = schema.safeParse({
      name: "kim",
      age: "28",
    });

    expect(result.success).toBe(false);
  });

  it("is narrows types after validation", () => {
    const schema = objectSchema({
      name: stringSchema(),
      age: numberSchema(),
    });

    const input: unknown = { name: "kim", age: 28 };
    if (schema.is(input)) {
      const user: Infer<typeof schema> = input;
      expect(user.age).toBe(28);
    } else {
      expect.fail("Expected input to be valid");
    }
  });

  it("assert throws on invalid input", () => {
    const schema = objectSchema({
      name: stringSchema(),
      age: numberSchema(),
    });

    const input: unknown = { name: "kim", age: "28" };
    expect(() => schema.assert(input)).toThrow();
  });

  it("optional allows undefined", () => {
    const schema = stringSchema().optional();
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
  });

  it("nullable allows null", () => {
    const schema = numberSchema().nullable();
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
  });

  it("refine applies custom rule", () => {
    const schema = numberSchema().refine((value) => value > 0, "Must be positive", "too_small");
    const result = schema.safeParse(-1);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0].code).toBe("too_small");
    }
  });

  it("format/flatten errors provide field mapping", () => {
    const schema = objectSchema({
      name: stringSchema(),
      age: numberSchema(),
    });

    const result = schema.safeParse({ name: 123, age: "20" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatErrors(result.errors);
      const flattened = flattenErrors(result.errors);
      expect(formatted.length).toBe(2);
      expect(flattened.fieldErrors["name"].length).toBe(1);
      expect(flattened.fieldErrors["age"].length).toBe(1);
    }
  });

  it("arraySchema validates items", () => {
    const schema = arraySchema(numberSchema());
    const result = schema.safeParse([1, 2, "3"]);
    expect(result.success).toBe(false);
  });

  it("optional works on array items", () => {
    const schema = arraySchema(stringSchema().optional());
    const result = schema.safeParse(["a", undefined, "b"]);
    expect(result.success).toBe(true);
  });
});
