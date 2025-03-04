import { AuthContext } from '@context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

export interface SendAnswerArgs {
  player: number;
  flagIso: string;
  name: string;
  isCorrect: boolean;
  selectedSquareIndex: number[];
}

async function handleSendAnswer(
  username: string | undefined,
  gameId: string | undefined,
  { player, flagIso, name, isCorrect, selectedSquareIndex }: SendAnswerArgs
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/ws/game/${gameId}/${username}`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'answer',
        gameId,
        player,
        isCorrect,
        flagIso,
        name,
        cell: {
          row: selectedSquareIndex[0] - 1,
          col: selectedSquareIndex[1] - 1
        }
      })
    }
  );

  if (!res.ok) {
    throw Error('Something went wrong!');
  }
}

export const useSendAnswer = () => {
  const { gameId } = useParams();
  const user = useContext(AuthContext);

  return useMutation({
    mutationFn: (args: SendAnswerArgs) =>
      handleSendAnswer(user?.username, gameId, args)
  });
};
