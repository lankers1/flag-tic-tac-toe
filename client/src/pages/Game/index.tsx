import { useEffect, useState } from "react";

import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";
import { AnswerModalContent } from "./components/AnswerModalContent";
import { useGameStore } from "../../store/useGameStore";
import { LinkButton } from "../../components/Buttons/LinkButton";
import { Notification } from "../../components/Notification";
import { Heading } from "../../components/Heading";
import styles from "./styles.module.scss";
import { determineMove, easyComputer } from "../../computer/rulesets";
import { useSearchFlags } from "../../query-hooks/searchFlags";

export const Game = () => {
  const { data: flags } = useSearchFlags("");
  const [selectedSquare, setSelectedSquare] = useState<number[]>([0, 0]);
  const { data, isLoading, isPending, error } = useGetGameQuery();
  const {
    selectedFlags,
    playersTurn,
    winner,
    setSelectedFlags,
    togglePlayerTurn,
  } = useGameStore((state) => state);

  useEffect(() => {
    if (playersTurn === 2 && !winner) {
      setTimeout(() => {
        setSelectedFlags(
          determineMove(
            easyComputer,
            selectedFlags.reduce((acc, r, oIndex) => {
              r.map((item, index) => {
                if (!item) {
                  acc = [...acc, [oIndex, index]];
                }
              });

              return acc;
            }, []),
            flags,
            selectedFlags,
            data.answers
          )
        );
        togglePlayerTurn();
      }, 2000);
    }
  }, [playersTurn, winner]);

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(outerIndex: number, innerIndex: number) {
    setSelectedSquare([outerIndex + 1, innerIndex + 1]);
  }

  return (
    <>
      <Notification backgroundColor={playersTurn === 1 ? "#002080" : "#ff6600"}>
        {!!winner ? (
          <Heading variant="h2" className={styles.notificationHeading}>
            Player {winner} has won! Congrats!!
          </Heading>
        ) : (
          <Heading variant="h2" className={styles.notificationHeading}>
            Player {playersTurn} it's your turn!
          </Heading>
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
