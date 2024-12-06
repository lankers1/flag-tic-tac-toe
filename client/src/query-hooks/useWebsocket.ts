import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initSocket = () => {
  let socket = null;
  if (!socket) {
    return new WebSocket(
      `ws://localhost:8080/ws/${Math.floor(100000 + Math.random() * 900000)}`
    );
  }
  return socket;
};

export const useWebsocket = () => {
  const navigate = useNavigate();
  const [websocket, setWebsocket] = useState<null | WebSocket>(null);

  useEffect(() => {
    let socket = null;
    if (!websocket) {
      socket = initSocket();
      setWebsocket(socket);
    }
    if (socket) {
      socket?.addEventListener('message', (event) => {
        navigate(`/game/111/${JSON.parse(event.data).gameId}`);
      });
    }
    return () => {
      socket?.close();
    };
  }, []);

  return websocket;
};
