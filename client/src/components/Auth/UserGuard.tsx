import { PropsWithChildren, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGameQuery } from '@query-hooks/getGame';
import { useGetUserQuery } from '@query-hooks/getUser';
import { Loader } from '@components/Loader';

import { AuthContext } from '../../context/AuthContext';
import styles from './styles.module.scss';

const getOpponentUsername = (game, username) => {
  if (game?.playerOneId !== username) return game?.playerOneId;
  return game?.playerTwoId;
};

export const UserGuard = ({ children }: PropsWithChildren) => {
  const { data, isLoading, isPending, error, refetch } = useGetGameQuery();
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
  }, [user, data]);

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
    return <p>Error... {error.message || opponentData?.error?.message}</p>;

  return children(data, opponentData?.data, refetch);
};
