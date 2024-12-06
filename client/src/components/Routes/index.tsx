import { createBrowserRouter } from 'react-router-dom';
import { Game } from '../../pages/Game';
import { Home } from '../../pages/Home';
import { Layout } from '../Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/game/:gameId',
        element: <Game />
      },
      {
        path: '/game/:player/:gameId',
        element: <Game />
      }
    ]
  }
]);
