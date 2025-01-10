import { useNavigate } from 'react-router-dom';

const userId = Math.floor(100000 + Math.random() * 900000);

let socket: WebSocket;

export const useSearchGameWs = (toggleDisplayModal: () => void) => {
  const navigate = useNavigate();

  function searchForGame() {
    socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_PORT}/ws`);

    socket.onclose = () => {
      console.log('connection closed');
    };

    socket.onmessage = (event) => {
      const gameId = JSON.parse(event.data).gameId;
      navigate(`/game/${userId}/${gameId}`);
      socket?.close();
    };

    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          type: 'search'
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
