import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { FaAngleUp } from 'react-icons/fa';
import { FlagAvatar } from '@components/FlagAvatar';
import { Heading } from '@components/Heading';
import { AuthContext } from '../../context/AuthContext';
import styles from './styles.module.scss';

export const Layout = () => {
  const user = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h1">Flag tic-tac-toe</Heading>
        {user?.loggedIn && <UserMenu />}
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
