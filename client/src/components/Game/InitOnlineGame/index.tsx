import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetGameQuery } from '@query-hooks/game/useGetGame';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';
import { Loader } from '@components/common/Loader';
import { AuthContext } from '@context/AuthContext';
import { useGameStore } from '@store/useGameStore';
import { PublicUser } from 'src/type-defs/user';
import { Game } from 'src/type-defs/game';

import styles from './styles.module.scss';

const getOpponentUsername = (
  game: Game | undefined,
  username: string | undefined
) => {
  if (game) {
    if (game?.playerOneId !== username) return game?.playerOneId;
    return game?.playerTwoId;
  }
  return '';
};

interface Props {
  children: (
    data: { game: Game; answers: Answers },
    opponent: { user: PublicUser },
    refetch: () => void
  ) => JSX.Element;
}

export const InitOnlineGame = ({ children }: Props) => {
  const { data, isLoading, isPending, error, refetch } = useGetGameQuery();
  const { setTurn, turn } = useGameStore((state) => state);
  const user = useContext(AuthContext);
  const opponentData = useGetUserQuery(
    getOpponentUsername(data?.game, user?.username)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (data && data?.game.completed) ||
      (data?.game &&
        user?.username !== data?.game.playerOneId &&
        user?.username !== data?.game.playerTwoId)
    ) {
      navigate('/');
    }

    if (data && turn === 0) {
      setTurn(data?.game?.playerOneId === user?.username ? 1 : 2);
    }
  }, [user, data, turn]);

  if (
    isLoading ||
    isPending ||
    opponentData?.isLoading ||
    opponentData?.isPending
  ) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || opponentData?.error)
    return <p>Error... {error?.message || opponentData?.error?.message}</p>;

  return children(data, opponentData?.data, refetch);
};
