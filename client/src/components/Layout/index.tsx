import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { FaAngleUp, FaFlag, FaTrophy } from 'react-icons/fa';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Heading } from '@components/common/Heading';
import { AuthContext } from '../../context/AuthContext';
import styles from './styles.module.scss';
import { Text } from '@components/common/Text';
import { Link } from '@components/common/Link';

export const Layout = () => {
  const user = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h3">Flag tic-tac-toe</Heading>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/leaderboard/1">
            <FaFlag className={styles.buttonIcons} />
            <Text fontSize="large">{'Flags'}</Text>
          </Link>
          <Link to="/leaderboard/1">
            <FaTrophy className={styles.buttonIcons} />
            <Text fontSize="large">{'Leaderboard'}</Text>
          </Link>
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
  const user = useContext(AuthContext);
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.innerContainer}>
          <FaAngleUp className={styles.icon} />
          <FlagAvatar flagIso2={user?.favouriteFlag} />
        </div>
        <div className={styles.menuItems}>
          <a>Account</a>
          <a onClick={user?.logout}>Logout</a>
        </div>
      </div>
    </div>
  );
};
