import { describe, expect, it } from "vitest";
import {
  booleanSchema,
  numberSchema,
  objectSchema,
  stringSchema,
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
});
