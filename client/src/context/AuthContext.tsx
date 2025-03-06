import { createContext, useState } from 'react';
import { PublicUser } from 'src/type-defs/user';

export interface UserContext {
  loggedIn: boolean;
  setUser: (user: PublicUser) => void;
  logout: () => void;
  favouriteFlag: string;
  username: string;
  token: string | undefined;
  rank: number;
}

export const AuthContext = createContext<UserContext | null>(null);

export const AuthContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || '{}')
  );
  const loggedIn = !!(user.token && user.username && user.rank);

  function setUserItem(user: PublicUser) {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser({});
  }

  return (
    <AuthContext.Provider
      value={{ ...user, loggedIn, logout, setUser: setUserItem }}
    >
      {children}
    </AuthContext.Provider>
  );
};
