import { createBrowserRouter } from 'react-router-dom';
import { Game } from './pages/Game';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/game/:player',
        element: <Game />
      },
      {
        path: '/game/:player/:gameId',
        element: <Game />
      }
    ]
  }
]);
