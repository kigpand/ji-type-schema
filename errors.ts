import { Path, ValidationError } from "./interface/ISchema";

const pathToString = (path: Path): string => {
  if (path.length === 0) {
    return "";
  }

  let result = "";
  for (const segment of path) {
    if (typeof segment === "number") {
      result += `[${segment}]`;
    } else {
      result = result ? `${result}.${segment}` : segment;
    }
  }
  return result;
};

export const flattenErrors = (errors: ValidationError[]) => {
  const formErrors: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  for (const error of errors) {
    const key = pathToString(error.path);
    if (!key) {
      formErrors.push(error.message);
      continue;
    }

    if (!fieldErrors[key]) {
      fieldErrors[key] = [];
    }
    fieldErrors[key].push(error.message);
  }

  return { formErrors, fieldErrors };
};

export const formatErrors = (errors: ValidationError[]) => {
  return errors.map((error) => {
    const key = pathToString(error.path);
    if (!key) {
      return error.message;
    }
    return `${key}: ${error.message}`;
  });
};
