import { useState } from "react";

import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";
import { AnswerModalContent } from "./components/AnswerModalContent";
import { useGameStore } from "../../store/useGameStore";
import { LinkButton } from "../../components/Buttons/LinkButton";
import { Notification } from "../../components/Notification";
import { Heading } from "../../components/Heading";
import styles from "./styles.module.scss";

export const Game = () => {
  const [selectedSquare, setSelectedSquare] = useState<number[]>([0, 0]);
  const { data, isLoading, isPending, error } = useGetGameQuery();
  const { selectedFlags, playersTurn, winner, setSelectedFlags } = useGameStore(
    (state) => state
  );

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(outerIndex: number, innerIndex: number) {
    setSelectedSquare([outerIndex + 1, innerIndex + 1]);
  }

  return (
    <>
      <header className={styles.header}>
        <Heading variant="h1">Flag tic-tac-toe</Heading>
      </header>
      <Notification backgroundColor={playersTurn === 1 ? "#002080" : "#ff6600"}>
        {!!winner ? (
          <h2 style={{ color: "white" }}>
            Player {winner} has won! Congrats!!
          </h2>
        ) : (
          <h2 style={{ color: "white" }}>
            Player {playersTurn} it's your turn!
          </h2>
        )}
      </Notification>
      <Gameboard
        handleClick={handleClick}
        data={data?.game}
        selectedFlags={selectedFlags}
        disabled={!!winner}
      />
      <LinkButton to="/" label="Give up!" />
      <Modal isOpen={!!selectedSquare[0]}>
        <AnswerModalContent
          answers={data?.answers}
          selectedSquareIndex={selectedSquare}
          closeModal={() => setSelectedSquare([0, 0])}
          onSelect={setSelectedFlags}
          selectedFlags={selectedFlags}
        />
      </Modal>
    </>
  );
};
