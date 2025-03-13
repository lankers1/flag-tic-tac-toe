import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Args {
  gameId: string;
  username: string | undefined;
}

async function handleUpdateGameWinner({ gameId, username }: Args) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/game/${gameId}/winner/${username}`,
    {
      method: 'POST'
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return res.json();
}

export const useUpdateGameWinnerQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateGameWinner,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.username] });
    }
  });
};
