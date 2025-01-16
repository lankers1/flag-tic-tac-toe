import { useQuery } from '@tanstack/react-query';

async function handleGetUser(username: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${username}`);
  return await res.json();
}

export const useGetUserQuery = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    gcTime: 0,
    queryFn: () => handleGetUser(username),
    refetchOnWindowFocus: false,
    enabled: !!username
  });
};
