import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/Inputs/TextInput';
import { Button } from '@components/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';

const initialState = {
  username: '',
  password: ''
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const { setUser } = useContext(AuthContext);

  function handleChange(key: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((state) => ({ ...state, [key]: event.target?.value }));
    };
  }

  async function login() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(form)
    });
    return await res.json();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const user = await login();
    setUser(user);
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
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>
          Don't have an account?
        </p>
        <Link to="../register" style={{ fontSize: '1rem', fontWeight: 500 }}>
          Create account
        </Link>
      </div>
    </form>
  );
};
