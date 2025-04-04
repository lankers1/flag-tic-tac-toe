import { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaAngleUp, FaFlag } from 'react-icons/fa';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Heading } from '@components/common/Heading';
import { AuthContext, UserContext } from '../../context/AuthContext';
import styles from './styles.module.scss';
import { Link } from '@components/common/Link';

import { Text } from '@components/common/Text';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';
import { FaHouse } from 'react-icons/fa6';

export const Layout = () => {
  const user = useContext(AuthContext);
  const location = useLocation();
  const regex = /\/game\/online/;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h2" bold>
          FTTT
        </Heading>
        <nav className={styles.nav}>
          {!regex.test(location.pathname) && (
            <Text>
              <Link to="/">
                <FaHouse className={styles.flagIcon} />
                Home
              </Link>
            </Text>
          )}
          {!regex.test(location.pathname) && (
            <Text>
              <Link to="/flags">
                <FaFlag className={styles.flagIcon} />
                Flags
              </Link>
            </Text>
          )}
          {user?.loggedIn && <UserMenu />}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const UserMenu = () => {
  const user = useContext(AuthContext) as UserContext;
  const { data, isLoading, isError } = useGetUserQuery(user?.username);

  const location = useLocation();
  const regex = /\/game\/online/;

  if (isLoading || isError) {
    return null;
  }

  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.innerContainer}>
          {!regex.test(location.pathname) && (
            <FaAngleUp className={styles.icon} />
          )}
          <FlagAvatar flagIso2={data?.user?.favouriteFlag} />
        </div>
        {!regex.test(location.pathname) && (
          <div className={styles.menuItems}>
            <Link to="/account" className={styles.link}>
              Account
            </Link>
            <Link to="/" className={styles.link} handleClick={user?.logout}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
