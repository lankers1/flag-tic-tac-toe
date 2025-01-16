import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

async function getGame(gameId: string | undefined) {
  if (gameId) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/game/${gameId}`);
    return await res.json();
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/game`);
  return await res.json();
}

export const useGetGameQuery = () => {
  const params = useParams();
  return useQuery<{ game: Game; answers: Answers }>({
    queryKey: ['game', params?.gameId],
    gcTime: 0,
    queryFn: () => getGame(params?.gameId),
    refetchOnWindowFocus: false
  });
};
