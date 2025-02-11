import { useMutation } from '@tanstack/react-query';

interface Args {
  username: string;
  password: string;
}

async function handleLogin(credentials: Args): Promise<User> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ ...credentials })
  });

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return await res.json();
}

export const useLoginQuery = () => useMutation({ mutationFn: handleLogin });
