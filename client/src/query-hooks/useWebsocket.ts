import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userId = Math.floor(100000 + Math.random() * 900000);

export const useWebsocket = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState();

  function searchForGame() {
    const socket = new WebSocket(`ws://localhost:8080/ws`);
    setSocket(socket);

    socket?.addEventListener('message', (event) => {
      navigate(`/game/${userId}/${JSON.parse(event.data).gameId}`);
      socket.removeEventListener('message', () =>
        console.log('removed socket')
      );
    });

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          type: 'message'
        })
      );
    });
  }

  return [socket, searchForGame];
};
