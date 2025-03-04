import { AuthContext } from '@context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

async function handleSendQuitGame(
  username: string | undefined,
  gameId: string | undefined
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/ws/game/${gameId}/${username}`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'quit'
      })
    }
  );

  if (!res.ok) {
    throw Error('Something went wrong!');
  }
}

export const useSendQuitGame = () => {
  const { gameId } = useParams();
  const user = useContext(AuthContext);

  return useMutation({
    mutationFn: () => handleSendQuitGame(user?.username, gameId)
  });
};
