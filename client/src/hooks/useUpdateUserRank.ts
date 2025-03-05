import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '@context/AuthContext';
import { useUpdateGameWinnerQuery } from '@query-hooks/game/useUpdateGameWinner';
import { useUpdateUserRankQuery } from '@query-hooks/user/useUpdateUserRank';

export const useUpdateUserRank = (
  turn: number,
  winner: number,
  opponentQuit: boolean
) => {
  const updateGameWinner = useUpdateGameWinnerQuery();
  const updateUserRank = useUpdateUserRankQuery();
  const { gameId } = useParams();
  const user = useContext(AuthContext);

  const isWinner = winner === turn && gameId && user;
  const isLoser = winner && winner !== turn && gameId && user;
  const opponentLeft = opponentQuit && gameId && user;

  async function completeGame() {
    if (isWinner) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user?.username,
        token: user?.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return await updateGameWinner.mutateAsync({
        gameId,
        username: user?.username
      });
    }

    if (isLoser) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'loss'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return;
    }

    if (opponentLeft) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return updateGameWinner.mutateAsync({ gameId, username: user?.username });
    }
  }

  useEffect(() => {
    completeGame();
  }, [turn, winner, user?.username, opponentQuit]);
};
