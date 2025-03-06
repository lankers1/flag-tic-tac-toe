import { useNavigate, useParams } from 'react-router-dom';
import { useGetUsersQuery } from '@query-hooks/user/useGetUsers';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { IconButton } from '@components/common/Buttons/IconButton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LinkButton } from '@components/common/Buttons/LinkButton';
import { Notification } from '@components/common/Notification';
import styles from './styles.module.scss';

export const Leaderboard = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const currentPage = (page && +page) || 1;
  const { data, isLoading, error, isError } = useGetUsersQuery(
    currentPage * 10 - 10
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isLoading && <Text>Loading</Text>}
        {isError && <Notification type="error">{error.message}</Notification>}
        {data && data?.users && data?.users?.length > 0 && (
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
                  {data?.users.map((user) => (
                    <tr key={user.username}>
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
          </>
        )}
        <footer className={styles.cardFooter}>
          <LinkButton label="Close" to="/" />
          <div className={styles.pagination}>
            <IconButton
              disabled={+currentPage === 1}
              Icon={FaChevronLeft}
              handleClick={() => navigate(`/leaderboard/${currentPage - 1}`)}
            />
            <Text fontSize="large">
              {currentPage}/{Math.ceil((data?.total || 10) / 10)}
            </Text>
            <IconButton
              disabled={+currentPage === Math.ceil((data?.total || 10) / 10)}
              Icon={FaChevronRight}
              handleClick={() => navigate(`/leaderboard/${currentPage + 1}`)}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};
