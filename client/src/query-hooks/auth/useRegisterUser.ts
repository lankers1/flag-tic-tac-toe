import { useMutation } from '@tanstack/react-query';
import { User } from '@type-defs/user';

async function handleRegisterUser(user: User) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return await res.json();
}

export const useRegisterUserQuery = () =>
  useMutation({ mutationFn: handleRegisterUser });
