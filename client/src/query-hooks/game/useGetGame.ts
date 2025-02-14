import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

async function handleGetGame(gameId: string | undefined) {
  if (gameId) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/game/${gameId}`);
    if (!res.ok) {
      const error = await res.json();
      throw Error(error);
    }
    return await res.json();
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/game`);
  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }
  return await res.json();
}

export const useGetGameQuery = () => {
  const params = useParams();
  return useQuery<{ game: Game; answers: Answers }>({
    queryKey: ['game', params?.gameId],
    gcTime: 0,
    queryFn: () => handleGetGame(params?.gameId),
    refetchOnWindowFocus: false
  });
};
