export { stringSchema } from "./handler/string";
export { numberSchema } from "./handler/number";
export { booleanSchema } from "./handler/boolean";
export { objectSchema } from "./handler/object";
export { arraySchema } from "./handler/array";

export type { Infer } from "./interface/ISchema";
export type { ValidationError } from "./interface/ISchema";
export { flattenErrors, formatErrors } from "./errors";
