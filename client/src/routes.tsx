import { createBrowserRouter } from 'react-router-dom';
import { Game } from './pages/Game';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { UserGuard } from '@components/Auth/UserGuard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/*',
        element: <Home />
      },
      {
        path: '/game/:player',
        element: <Game />
      },
      {
        path: '/game/:player/:gameId',
        element: (
          <UserGuard>
            {(gameData, opponent, refetch) => (
              <Game gameData={gameData} opponent={opponent} refetch={refetch} />
            )}
          </UserGuard>
        )
      }
    ]
  }
]);
