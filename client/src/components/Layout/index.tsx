import { Outlet } from 'react-router-dom';
import styles from './styles.module.scss';
import { Heading } from '../Heading';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as flags from 'country-flag-icons/react/1x1';
import { FaAngleUp } from 'react-icons/fa';

export const Layout = () => {
  const user = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h1">Flag tic-tac-toe</Heading>
        {user.loggedIn && <FlagAvatar />}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const FlagAvatar = () => {
  const user = useContext(AuthContext);
  const Flag = flags?.[user?.favouriteFlag as keyof typeof flags];
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.innerContainer}>
          <FaAngleUp className={styles.icon} />
          <Flag className={styles.flagAvatar} height="48" width="48" />
        </div>
        <div className={styles.menuItems}>
          <a>Account</a>
          <a onClick={user.logout}>Logout</a>
        </div>
      </div>
    </div>
  );
};
