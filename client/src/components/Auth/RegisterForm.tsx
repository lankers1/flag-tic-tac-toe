import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/Inputs/TextInput';
import { Button } from '@components/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { useRegisterUserQuery } from '@query-hooks/auth/useRegisterUser';
import { Notification } from '@components/Notification';
import { Text } from '@components/common/Text';

const initialState = {
  username: '',
  password: '',
  email: '',
  rank: 1000,
  favouriteFlag: ''
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<null | { message: string }>(null);
  const mutation = useRegisterUserQuery();
  const user = useContext(AuthContext);

  function handleChange(key: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((state) => ({ ...state, [key]: event.target?.value }));
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event?.preventDefault();
      const userRes = await mutation.mutateAsync(form);
      user?.setUser(userRes);
      navigate('../..');
    } catch (error) {
      setError(error);
    }
  }

  return (
    <>
      {error && (
        <Notification backgroundColor="#ff9494">
          <Text>{error?.message}</Text>
        </Notification>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextInput
          label="Username"
          name="username"
          placeholder="Enter your username"
          handleChange={handleChange('username')}
        />
        <TextInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          handleChange={handleChange('password')}
        />
        <TextInput
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
          handleChange={handleChange('email')}
        />
        <Button
          color="green"
          type="submit"
          label="Create Account"
          size="xlarge"
        />
        <div style={{ textAlign: 'center' }}>
          <Text fontSize="small">Already have an account?</Text>
          <Link to="../login" style={{ fontSize: '1rem', fontWeight: 500 }}>
            Log in
          </Link>
        </div>
      </form>
    </>
  );
};
