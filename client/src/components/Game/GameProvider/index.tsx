import { useGetGameQuery } from '@query-hooks/game/useGetGame';
import { Loader } from '@components/common/Loader';

import styles from './styles.module.scss';
import { Notification } from '@components/common/Notification';
import { Answers, Game } from '@type-defs/game';

interface Props {
  children: (
    data: { game: Game; answers: Answers },
    refetch: () => void
  ) => JSX.Element;
}

export const GameProvider = ({ children }: Props) => {
  const { data, isLoading, isPending, isError, error, refetch } =
    useGetGameQuery();

  if (isLoading || isPending) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className={styles.errorContainer}>
        <Notification type="error">Error... {error?.message}</Notification>
      </div>
    );

  return children(data, refetch);
};
