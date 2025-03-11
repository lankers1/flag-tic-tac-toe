import { createBrowserRouter } from 'react-router-dom';

import { GameProvider } from '@components/Game/GameProvider';
import { Home } from '@pages/Home';
import { Layout } from '@components/Layout';
import { Game } from '@pages/Game';
import { InitOnlineGame } from '@components/Game/InitOnlineGame';
import { Board } from '@type-defs/game';
import { Account } from '@pages/Account';

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
        element: <Account />
      },
      {
        path: '/game/:player/:gameId',
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
