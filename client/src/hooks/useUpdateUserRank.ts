import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext, UserContext } from '@context/AuthContext';
import { useUpdateGameWinnerQuery } from '@query-hooks/game/useUpdateGameWinner';
import { useUpdateUserRankQuery } from '@query-hooks/user/useUpdateUserRank';

export const useUpdateUserRank = (
  turn: number,
  winner: number | null,
  opponentQuit: boolean
) => {
  const updateGameWinner = useUpdateGameWinnerQuery();
  const updateUserRank = useUpdateUserRankQuery();
  const { gameId } = useParams();
  const user = useContext(AuthContext) as UserContext;

  const isWinner = winner === turn && gameId && user;
  const isLoser = winner && winner !== turn && gameId && user;
  const opponentLeft = opponentQuit && gameId && user;

  async function completeGame() {
    if (isWinner) {
      await updateUserRank.mutateAsync({
        username: user?.username,
        token: user?.token,
        result: 'win'
      });
      return await updateGameWinner.mutateAsync({
        gameId,
        username: user?.username
      });
    }

    if (isLoser) {
      await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'loss'
      });
      return;
    }

    if (opponentLeft) {
      await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'win'
      });
      return updateGameWinner.mutateAsync({ gameId, username: user?.username });
    }
  }

  useEffect(() => {
    completeGame();
  }, [turn, winner, user?.username, opponentQuit]);
};
