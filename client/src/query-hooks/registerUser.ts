import { useMutation } from '@tanstack/react-query';

async function handleRegisterUser(user) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return res.json();
}

export const registerUser = () =>
  useMutation({ mutationFn: handleRegisterUser });
