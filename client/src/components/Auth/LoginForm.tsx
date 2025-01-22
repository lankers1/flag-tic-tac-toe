import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/common/Inputs/TextInput';
import { Button } from '@components/common/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { useLoginQuery } from '@query-hooks/auth/useLogin';
import { Text } from '@components/common/Text';

const initialState = {
  username: '',
  password: ''
};

export const LoginForm = () => {
  const mutation = useLoginQuery();
  const [form, setForm] = useState(initialState);
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  function handleChange(key: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((state) => ({ ...state, [key]: event.target?.value }));
    };
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const userRes = await mutation.mutateAsync(form);
    user?.setUser(userRes);
    navigate('../..');
  }

  return (
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
      <Button color="green" type="submit" label=" Log in" size="xlarge" />
      <div style={{ textAlign: 'center' }}>
        <Text fontSize="small">Don't have an account?</Text>
        <Link to="../register" style={{ fontSize: '1rem', fontWeight: 500 }}>
          Create account
        </Link>
      </div>
    </form>
  );
};
