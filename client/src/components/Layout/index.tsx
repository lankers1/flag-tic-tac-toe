import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { FaAngleUp } from 'react-icons/fa';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Heading } from '@components/common/Heading';
import { AuthContext, UserContext } from '../../context/AuthContext';
import styles from './styles.module.scss';
import { Link } from '@components/common/Link';

export const Layout = () => {
  const user = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h2" bold>
          FTTT
        </Heading>
        <nav className={styles.nav}>{user?.loggedIn && <UserMenu />}</nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const UserMenu = () => {
  const user = useContext(AuthContext) as UserContext;
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.innerContainer}>
          <FaAngleUp className={styles.icon} />
          <FlagAvatar flagIso2={user.favouriteFlag} />
        </div>
        <div className={styles.menuItems}>
          <Link to="/account" className={styles.link}>
            Account
          </Link>
          <Link className={styles.link} handleClick={user?.logout}>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};
