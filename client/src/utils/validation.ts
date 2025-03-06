export interface Errors {
  [key: string]: string | undefined;
}

type SchemaFunction = (value: string) => string | undefined;

export function validation(
  form: Record<string, string>,
  validationSchema: Record<string, SchemaFunction[]>
) {
  let errored = false;
  const errors: Errors = {};

  Object.keys(form).map((key) => {
    validationSchema[key].map((schema) => {
      const error = schema(form[key]);
      if (error) {
        errored = true;
        errors[key] = error;
      }
    })[0];
  });

  return { errors, errored };
}

export function requiredValidation(value: string): string | undefined {
  if (value.length === 0) {
    return 'Field is required';
  }
}

export function lengthValidation(min: number, max: number) {
  return (value: string): string | undefined => {
    if (value.length < min || value.length > max) {
      return 'Field must be between 6 and 16 characters';
    }
  };
}

export function characterValidation(value: string): string | undefined {
  const regex = /^[^-\\s][a-zA-Z0-9]+$/g;
  const found = value.match(regex);
  if (!found) {
    return 'Field can only contain letters or numbers';
  }
}

export function emailValidation(value: string): string | undefined {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const found = value.match(regex);
  if (!found) {
    return 'Email not in correct format';
  }
}
