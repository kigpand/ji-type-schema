import { Infer, ISchema } from "../interface/ISchema";
import { ObjectSchema } from "../schema/objectSchema";

export const objectSchema = <TShape extends Record<string, ISchema<unknown>>>(
  shape: TShape
): ISchema<{ [K in keyof TShape]: Infer<TShape[K]> }> => {
  return new ObjectSchema(shape);
};
