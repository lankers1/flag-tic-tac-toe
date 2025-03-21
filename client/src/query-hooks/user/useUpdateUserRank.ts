import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Args {
  username: string | undefined;
  token: string | undefined;
  result: 'win' | 'loss';
}

async function handleUpdateUserRank({ username, token, result }: Args) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/user/${username}/score`,
    {
      method: 'PATCH',
      body: JSON.stringify({ token, result })
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return res.json();
}

export const useUpdateUserRankQuery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateUserRank,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.username] });
    }
  });
};
