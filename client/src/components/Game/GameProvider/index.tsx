import { useGetGameQuery } from '@query-hooks/game/useGetGame';
import { Loader } from '@components/common/Loader';

import styles from './styles.module.scss';

interface Props {
  children: (
    data: { game: Game; answers: Answers },
    refetch: () => void
  ) => JSX.Element;
}

export const GameProvider = ({ children }: Props) => {
  const { data, isLoading, isPending, error, refetch } = useGetGameQuery();

  if (isLoading || isPending) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) return <p>Error... {error?.message}</p>;

  return children(data, refetch);
};
