import { createBrowserRouter } from 'react-router-dom';
import { Game } from './pages/Game';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { UserGuard } from '@components/Auth/UserGuard';
import { GameProvider } from '@components/Game/GameProvider';
import { Leaderboard } from '@pages/Leaderboard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/*',
        element: <Home />
      },
      {
        path: '/leaderboard',
        element: <Leaderboard />
      },
      {
        path: '/game/:player',
        element: (
          <GameProvider>
            {(gameData, refetch) => (
              <Game gameData={gameData} refetch={refetch} />
            )}
          </GameProvider>
        )
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
