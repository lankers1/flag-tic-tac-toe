import { useQuery } from '@tanstack/react-query';

interface User {
  favouriteFlag: string;
  username: string;
  rank: number;
}

async function handleGetUsers(
  offset: number
): Promise<{ users: User[]; total: number }> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ offset })
  });
  if (!res.ok) {
    const response = await res.json();
    throw new Error(response);
  }
  return await res.json();
}

export const useGetUsersQuery = (offset: number) => {
  return useQuery({
    queryKey: ['users', offset],
    queryFn: () => handleGetUsers(offset),
    refetchOnWindowFocus: false
  });
};
