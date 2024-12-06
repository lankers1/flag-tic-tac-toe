import { useEffect, useState } from 'react';

const initSocket = () => {
  let socket = null;
  if (!socket) {
    console.log(socket);
    return new WebSocket(
      `ws://localhost:8080/ws/${Math.floor(100000 + Math.random() * 900000)}`
    );
  }
  return socket;
};

export const useWebsocket = () => {
  const [websocket, setWebsocket] = useState(null);
  useEffect(() => {
    let socket = null;
    if (!websocket) {
      socket = initSocket();
      setWebsocket(socket);
    }
    if (socket) {
      socket?.addEventListener('message', (event) => {
        console.log(JSON.parse(event.data).gameId);
      });
    }
    return () => {
      socket?.close();
    };
  }, []);

  return websocket;
};
