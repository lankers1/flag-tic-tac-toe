import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, UserContext } from '@context/AuthContext';

let socket: WebSocket;

export const useSearchGameWs = () => {
  const [displayGameSearchModal, setDisplayGameSearchModal] = useState(false);
  const user = useContext(AuthContext) as UserContext;
  const [displayAccountSearchingModal, setDisplayAccountSearchingModal] =
    useState(false);

  const navigate = useNavigate();

  function toggleDisplaySearchModal() {
    setDisplayGameSearchModal((state) => !state);
  }

  function closeAccountSearchingModal() {
    setDisplayAccountSearchingModal(false);
  }

  function searchForGame() {
    const isAccountSearching =
      localStorage.getItem('ftt-searching-for-game') === user?.username;

    if (isAccountSearching) {
      return setDisplayAccountSearchingModal(true);
    }

    socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_PORT}/ws/search-game/${user?.username}`
    );

    socket.onclose = () => {
      console.log('connection closed');
      localStorage.removeItem('ftt-searching-for-game');
    };

    socket.onmessage = (event) => {
      const gameId = JSON.parse(event.data).gameId;
      socket?.close();
      navigate(`/game/online/${gameId}`);
    };

    socket.onopen = () => {
      console.info('websocket connected');
      localStorage.setItem('ftt-searching-for-game', user?.username || '');
      toggleDisplaySearchModal();
    };
  }

  function cancelSearch() {
    localStorage.removeItem('ftt-searching-for-game');
    socket?.close();
    toggleDisplaySearchModal();
  }

  useEffect(() => {
    cancelSearch();
  }, []);

  return {
    displayGameSearchModal,
    searchForGame,
    cancelSearch,
    displayAccountSearchingModal,
    closeAccountSearchingModal
  };
};
