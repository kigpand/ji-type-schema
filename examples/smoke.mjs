import { booleanSchema, numberSchema, objectSchema, stringSchema } from "../dist/index.js";

const User = objectSchema({
  name: stringSchema(),
  age: numberSchema(),
  active: booleanSchema(),
});

const ok = User.safeParse({ name: "kim", age: 28, active: true });
console.log("ok:", ok);

const bad = User.safeParse({ name: "kim", age: "28", active: "yes" });
console.log("bad:", bad);
