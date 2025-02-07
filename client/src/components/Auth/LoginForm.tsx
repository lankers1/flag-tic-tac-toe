import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/common/Inputs/TextInput';
import { Button } from '@components/common/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { useLoginQuery } from '@query-hooks/auth/useLogin';
import { Text } from '@components/common/Text';
import { Form } from '@components/common/Form';
import { authValidation } from './validation';

const initialData = {
  username: '',
  password: ''
};

export const LoginForm = () => {
  const mutation = useLoginQuery();
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  async function handleSubmit(form: { username: string; password: string }) {
    const userRes = await mutation.mutateAsync(form);
    user?.setUser(userRes);
    navigate('../..');
  }

  return (
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
            <Button color="green" type="submit" label=" Log in" size="xlarge" />
            <div style={{ textAlign: 'center' }}>
              <Text fontSize="small">Don't have an account?</Text>
              <Link
                to="../register"
                style={{ fontSize: '1rem', fontWeight: 500 }}
              >
                Create account
              </Link>
            </div>
          </>
        );
      }}
    </Form>
  );
};
