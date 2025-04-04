import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/common/Inputs/TextInput';
import { Button } from '@components/common/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { useLoginQuery } from '@query-hooks/auth/useLogin';
import { Text } from '@components/common/Text';
import { Form } from '@components/common/Form';
import { authValidation } from './validation';
import { Notification } from '@components/common/Notification';

const initialData = {
  username: '',
  password: ''
};

export const LoginForm = () => {
  const mutation = useLoginQuery();
  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const [error, setError] = useState<{ message: null | string }>({
    message: null
  });

  async function handleSubmit(form: { username: string; password: string }) {
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
        validation={authValidation}
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
              <Button
                className={styles.submitButton}
                color="green"
                type="submit"
                label="Log in"
                size="medium"
              />
              <footer className={styles.footer}>
                <Text fontSize="small">Don't have an account?</Text>
                <Text fontSize="small">
                  <Link to="../register">Create account</Link>
                </Text>
              </footer>
            </>
          );
        }}
      </Form>
    </>
  );
};
