import { createBrowserRouter } from 'react-router-dom';

import { GameProvider } from '@components/Game/GameProvider';
import { Home } from '@pages/Home';
import { Layout } from '@components/Layout';
import { Game } from '@pages/Game';
import { InitOnlineGame } from '@components/Game/InitOnlineGame';
import { Board } from '@type-defs/game';
import { Account } from '@pages/Account';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { Flags } from '@pages/Flags';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/*',
        errorElement: <ErrorBoundary />,
        element: <Home />
      },
      {
        path: '/flags',
        errorElement: <ErrorBoundary />,
        element: <Flags />
      },
      {
        path: '/game/:player',
        errorElement: <ErrorBoundary />,
        element: (
          <GameProvider>
            {(gameData, refetch) => (
              <Game
                gameData={gameData}
                board={gameData.game as unknown as Board}
                refetch={refetch}
              />
            )}
          </GameProvider>
        )
      },
      {
        path: '/account',
        errorElement: <ErrorBoundary />,
        element: <Account />
      },
      {
        path: '/game/:player/:gameId',
        errorElement: <ErrorBoundary />,
        element: (
          <InitOnlineGame>
            {(gameData, opponent, refetch) => (
              <Game
                gameData={gameData}
                board={gameData?.game?.board}
                opponent={opponent}
                refetch={refetch}
              />
            )}
          </InitOnlineGame>
        )
      }
    ]
  }
]);
