import { useState } from "react";
import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";
import { AnswerModalContent } from "./components/AnswerModalContent";
import { useGameStore } from "../../store/useGameStore";
import { LinkButton } from "../../components/Buttons/LinkButton";

export const Game = () => {
  const [selectedFlags, setSelectedFlags] = useState([
    ...Array(9).fill(null, 0),
  ]);
  const [selectedSquare, setSelectedSquare] = useState<null | number>(null);
  const { data, isLoading, isPending, error } = useGetGameQuery();
  const { playersTurn } = useGameStore((state) => state);

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(index: number) {
    setSelectedSquare(index + 1);
  }

  return (
    <>
      <header style={{ width: "100%" }}>
        <h1
          style={{ fontWeight: 400, letterSpacing: ".2rem", fontSize: "64px" }}
        >
          Flag tic-tac-toe
        </h1>
      </header>
      <h2>Player {playersTurn} it's your turn!</h2>
      <Gameboard
        handleClick={handleClick}
        data={data?.game}
        selectedFlags={selectedFlags}
      />
      <LinkButton to="/" label="Give up!" />
      <Modal isOpen={!!selectedSquare}>
        <AnswerModalContent
          answers={data?.answers}
          selectedSquareIndex={selectedSquare}
          closeModal={() => setSelectedSquare(null)}
          onSelect={setSelectedFlags}
          selectedFlags={selectedFlags}
        />
      </Modal>
    </>
  );
};
