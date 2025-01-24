import { Card } from '@components/common/Card';
import { useGetUsersQuery } from '@query-hooks/user/useGetUsers';
import styles from './styles.module.scss';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';

export const Leaderboard = () => {
  const { data, isLoading, isPending, error, refetch } = useGetUsersQuery();

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card className={styles.card}>
        {isLoading && <Text>Loading</Text>}
        {data?.length > 0 && (
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
        )}
      </Card>
    </div>
  );
};
