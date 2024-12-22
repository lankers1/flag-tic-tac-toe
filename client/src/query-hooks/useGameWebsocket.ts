import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { answerMap } from '../pages/Game/components/AnswerModalContent';

const initSocket = (gameId: string, player: string) => {
  let socket = null;
  if (!socket) {
    return new WebSocket(`ws://localhost:8080/ws/game/${gameId}`);
  }
  return socket;
};

export const useIsMount = () => {
  const [isMount, setIsMount] = useState(true);
  useEffect(() => {
    setIsMount(false);
  }, []);
  return isMount;
};

export const useGameWebsocket = (
  setSelectedFlags,
  togglePlayerTurn,
  setIncorrectAnswer,
  answers,
  currentTurn
) => {
  const { player, gameId } = useParams();
  const [websocket, setWebsocket] = useState<null | WebSocket>(null);
  const [newAnswer, setNewAnswer] = useState(null);
  const [turn, setTurn] = useState(null);
  const isMount = useIsMount();

  useEffect(() => {
    let socket = initSocket(gameId, player);
    setWebsocket(socket);
    socket?.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        if (!turn) {
          setTurn(message.playerTurn);
        } else if (message.type === 'turn') {
          if (!message.isCorrect) {
            setIncorrectAnswer({
              name: message.name,
              iso_2: message.flagIso,
              player: currentTurn,
              cell: {
                row: message?.cell?.row,
                col: message?.cell?.col
              }
            });
            togglePlayerTurn();
          } else {
            const answerKey = answerMap[message.cell.row][message.cell.col];

            const answerArr = answers[answerKey];

            setSelectedFlags(
              message?.cell?.row,
              message?.cell?.col,
              message.name,
              message.flagIso,
              answerArr,
              message.player
            );
            togglePlayerTurn();
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      socket?.close();
    };
  }, [player, gameId, turn, JSON.stringify(answers)]);

  return [websocket, turn];
};
