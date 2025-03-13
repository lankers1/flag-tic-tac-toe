import { FlexDiv } from '@components/common/FlexDiv';
import { Notification } from '@components/common/Notification';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';
import { createContext, useState } from 'react';
import { PublicUser } from 'src/type-defs/user';
import styles from './styles.module.scss';

export interface UserContext {
  loggedIn: boolean;
  setUser: (user: PublicUser) => void;
  logout: () => void;
  favouriteFlag: string;
  rank: number;
  username: string;
  token: string | undefined;
}

const ERROR_MESSAGE =
  'Something went wrong fetching your account data, please try again later';

export const AuthContext = createContext<UserContext | null>(null);

export const AuthContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || '{}')
  );
  const { data, isError } = useGetUserQuery(user?.username);

  const loggedIn = !!(user.token && user.username);

  function setUserItem(user: PublicUser) {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser({});
  }

  if (isError) {
    return (
      <FlexDiv
        alignItems="center"
        justifyContent="center"
        className={styles.notificationContainer}
      >
        <div>
          <Notification type="error">{ERROR_MESSAGE}</Notification>
        </div>
      </FlexDiv>
    );
  }

  return (
    <AuthContext.Provider
      value={{ ...user, ...data, loggedIn, logout, setUser: setUserItem }}
    >
      {children}
    </AuthContext.Provider>
  );
};
