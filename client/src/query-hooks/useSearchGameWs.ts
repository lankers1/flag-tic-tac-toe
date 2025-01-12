import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

let socket: WebSocket;

export const useSearchGameWs = (toggleDisplayModal: () => void) => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  function searchForGame() {
    socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_PORT}/ws/${user?.username}`
    );

    socket.onclose = () => {
      console.log('connection closed');
    };

    socket.onmessage = (event) => {
      const gameId = JSON.parse(event.data).gameId;
      navigate(`/game/online/${gameId}`);
      socket?.close();
    };

    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          type: 'search',
          user
        })
      );
      toggleDisplayModal();
    };
  }

  function cancelSearch() {
    socket?.close();
    toggleDisplayModal();
  }

  return { searchForGame, cancelSearch };
};
