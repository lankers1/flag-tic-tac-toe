import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@components/Inputs/TextInput';
import { Button } from '@components/Buttons/Button';
import styles from './styles.module.scss';
import { AuthContext } from '../../context/AuthContext';

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
  const user = useContext(AuthContext);

  async function register() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(form)
    });
    return await res.json();
  }

  function handleChange(key: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((state) => ({ ...state, [key]: event.target?.value }));
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const userRes = await register();
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
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>
          Already have an account?
        </p>
        <Link to="../login" style={{ fontSize: '1rem', fontWeight: 500 }}>
          Log in
        </Link>
      </div>
    </form>
  );
};
