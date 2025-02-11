import { useQuery } from '@tanstack/react-query';

async function handleGetUsers() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
  if (!res.ok) {
    const response = await res.json();
    throw new Error(response);
  }
  return await res.json();
}

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    gcTime: 0,
    queryFn: handleGetUsers,
    refetchOnWindowFocus: false
  });
};
