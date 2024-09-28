import { useState } from "react";
import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";
import { AnswerModalContent } from "./components/AnswerModalContent";

export const Game = () => {
  const [selectedFlags, setSelectedFlags] = useState([
    ...Array(9).fill(null, 0),
  ]);
  const [selectedSquare, setSelectedSquare] = useState<null | number>(null);
  const { data, isLoading, isPending, error } = useGetGameQuery();

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(index: number) {
    setSelectedSquare(index + 1);
  }

  return (
    <>
      <Gameboard
        handleClick={handleClick}
        data={data?.game}
        selectedFlags={selectedFlags}
      />
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
