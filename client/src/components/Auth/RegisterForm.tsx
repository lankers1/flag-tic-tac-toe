import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/common/Inputs/TextInput';
import { Button } from '@components/common/Buttons/Button';
import styles from './styles.module.scss';
import { useRegisterUserQuery } from '@query-hooks/auth/useRegisterUser';
import { Notification } from '@components/common/Notification';
import { Text } from '@components/common/Text';
import { Form } from '@components/common/Form';
import { registerValidation } from './validation';
import { User } from '@type-defs/user';
import { AuthContext } from '@context/AuthContext';

const initialData = {
  username: '',
  password: '',
  email: '',
  rank: 1000,
  favouriteFlag: ''
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<{ message: null | string }>({
    message: null
  });
  const mutation = useRegisterUserQuery();
  const user = useContext(AuthContext);

  async function handleSubmit(form: User) {
    try {
      const userRes = await mutation.mutateAsync(form);
      user?.setUser(userRes);
      navigate('../..');
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  }

  return (
    <>
      <Form
        initialData={initialData}
        handleSubmit={handleSubmit}
        className={styles.form}
        validation={registerValidation}
      >
        {(form, setForm, errors) => {
          function handleChange(key: string) {
            return (event: React.ChangeEvent<HTMLInputElement>) => {
              setForm(key, event.target.value);
            };
          }

          return (
            <>
              {error?.message && (
                <Notification type="error">
                  <Text>{error?.message}</Text>
                </Notification>
              )}
              <TextInput
                label="Username"
                name="username"
                placeholder="Enter your username"
                handleChange={handleChange('username')}
                value={form.username}
                error={errors?.username}
              />
              <TextInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                handleChange={handleChange('password')}
                value={form.password}
                error={errors?.password}
              />
              <TextInput
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
                handleChange={handleChange('email')}
                value={form.email}
                error={errors?.email}
              />
              <Button
                color="green"
                type="submit"
                label="Create Account"
                size="medium"
              />
              <footer className={styles.footer}>
                <Text fontSize="small">Already have an account?</Text>
                <Text fontSize="small">
                  <Link to="../login">Log in</Link>
                </Text>
              </footer>
            </>
          );
        }}
      </Form>
    </>
  );
};
