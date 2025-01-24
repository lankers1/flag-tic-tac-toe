import { Card } from '@components/common/Card';
import { useGetUsersQuery } from '@query-hooks/user/useGetUsers';
import styles from './styles.module.scss';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { IconButton } from '@components/common/Buttons/IconButton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { LinkButton } from '@components/common/Buttons/LinkButton';

export const Leaderboard = () => {
  const { page } = useParams();
  const { data, isLoading, isPending, error, refetch } = useGetUsersQuery();
  const currentPage = (page && +page) || 1;

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {isLoading && <Text>Loading</Text>}
        {data?.length > 0 && (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeadRow}>
                    <th scope="col" className={styles.tableHead}>
                      <Text fontSize="large">Username</Text>
                    </th>
                    <th scope="col" className={styles.tableHead}>
                      <Text fontSize="large">Rank</Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr>
                      <td className={styles.tableData}>
                        <div className={styles.usernameCol}>
                          <FlagAvatar flagIso2={user.favouriteFlag} />
                          <Text>{user.username}</Text>
                        </div>
                      </td>
                      <td className={styles.tableData}>
                        <Text>{user.rank}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className={styles.cardFooter}>
              <LinkButton label="Back" to="/" />
              <div className={styles.pagination}>
                <IconButton
                  disabled={+currentPage === 1}
                  Icon={FaChevronLeft}
                />
                <Text fontSize="large">
                  {currentPage}/{Math.ceil(data.length / 10)}
                </Text>
                <IconButton
                  disabled={+currentPage === Math.ceil(data.length / 10)}
                  Icon={FaChevronRight}
                />
              </div>
            </footer>
          </>
        )}
      </Card>
    </div>
  );
};
