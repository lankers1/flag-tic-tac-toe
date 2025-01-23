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
          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Username</th>
                <th scope="col">Rank</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr>
                  <td>
                    <FlagAvatar flagIso2={user.favouriteFlag} />
                  </td>
                  <td>
                    <Text>{user.username}</Text>
                  </td>
                  <td>{user.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};
