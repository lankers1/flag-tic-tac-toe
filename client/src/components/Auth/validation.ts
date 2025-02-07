import {
  characterValidation,
  lengthValidation,
  requiredValidation,
  emailValidation,
  validation
} from '@utils/validation';

export function authValidation(form: { username: string; password: string }) {
  return validation(form, {
    username: [
      lengthValidation(3, 16),
      characterValidation,
      requiredValidation
    ],
    password: [lengthValidation(3, 16), characterValidation, requiredValidation]
  });
}

export function registerValidation(form: {
  username: string;
  password: string;
  email: string;
}) {
  return validation(form, {
    username: [
      lengthValidation(3, 16),
      characterValidation,
      requiredValidation
    ],
    password: [
      lengthValidation(3, 16),
      characterValidation,
      requiredValidation
    ],
    email: [emailValidation, requiredValidation]
  });
}
