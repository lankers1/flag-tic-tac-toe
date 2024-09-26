import { useState } from "react";
import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";

export const Game = () => {
  const [selectedSquare, setSelectedSquare] = useState<null | number>(null);
  const { data, isLoading, isPending, error } = useGetGameQuery();

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(index: number) {
    setSelectedSquare(index + 1);
  }

  return (
    <>
      <Gameboard handleClick={handleClick} data={data} />
      <Modal isOpen={!!selectedSquare} />
    </>
  );
};
