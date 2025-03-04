import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

let socket: WebSocket;

export const useSearchGameWs = (toggleDisplayModal: () => void) => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  function searchForGame() {
    socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_PORT}/ws/search-game/${user?.username}`
    );

    socket.onclose = () => {
      console.log('connection closed');
    };

    socket.onmessage = (event) => {
      const gameId = JSON.parse(event.data).gameId;
      socket?.close();
      navigate(`/game/online/${gameId}`);
    };

    socket.onopen = () => {
      console.info('websocket connected');
      toggleDisplayModal();
    };
  }

  function cancelSearch() {
    socket?.close();
    toggleDisplayModal();
  }

  return { searchForGame, cancelSearch };
};
