import { AuthContext } from '@context/AuthContext';
import { useUpdateGameWinnerQuery } from '@query-hooks/game/useUpdateGameWinner';
import { useUpdateUserRankQuery } from '@query-hooks/user/useUpdateUserRank';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useUpdateUserRank = (turn, winner, opponentQuit) => {
  const mutation = useUpdateGameWinnerQuery();
  const updateUserRank = useUpdateUserRankQuery();
  const { gameId } = useParams();

  const user = useContext(AuthContext);

  async function completeGame() {
    if (winner === turn && gameId && user) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user?.username,
        token: user?.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return await mutation.mutateAsync({ gameId, username: user?.username });
    }

    if (winner && winner !== turn && gameId && user) {
      console.log('LOSSSSS');
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

    if (opponentQuit && gameId && user) {
      const userResponse = await updateUserRank.mutateAsync({
        username: user.username,
        token: user.token,
        result: 'win'
      });
      user.setUser({
        ...user,
        rank: userResponse.rank
      });
      return mutation.mutateAsync({ gameId, username: user?.username });
    }
  }

  useEffect(() => {
    completeGame();
  }, [turn, winner, user?.username, opponentQuit]);
};
