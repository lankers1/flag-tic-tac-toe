import { Errors } from '@utils/validation';
import { ReactElement, useState } from 'react';

type Form = Record<string, unknown>;

interface Props<T extends object> {
  initialData: T;
  className?: string;
  handleSubmit: (form: T) => void;
  validation: (form: T) => { errors: Errors; errored: boolean };
  children: (
    form: T,
    setForm: (key: string, value: string) => void,
    errors?: Errors
  ) => ReactElement;
}

export const Form = <T extends { [key: string]: any }>({
  children,
  handleSubmit,
  className,
  initialData,
  validation
}: Props<T>) => {
  const [errors, setErrors] = useState<Errors>();
  const [form, setForm] = useState(initialData);

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const { errors, errored } = validation(form);
    if (errored) {
      setErrors(errors);
      return;
    }
    handleSubmit(form);
  }

  function handleChange(key: string, value: string) {
    setErrors((state) => {
      if (state && state[key]) {
        const { [key]: _, ...form } = state;
        return form;
      }
      return state;
    });
    return setForm((state) => ({ ...state, [key]: value }));
  }

  return (
    <form onSubmit={handleFormSubmit} className={className}>
      {children(form, handleChange, errors)}
    </form>
  );
};
