import { ISchema } from "../interface/ISchema";
import { ArraySchema } from "../schema/arraySchema";

export const arraySchema = <T>(item: ISchema<T>): ISchema<T[]> => {
  return new ArraySchema(item);
};
