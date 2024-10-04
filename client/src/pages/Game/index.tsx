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
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";

export const Game = () => {
  const { player } = useParams();
  const { data: flags } = useSearchFlags("");
  const [selectedSquare, setSelectedSquare] = useState<number[]>([0, 0]);
  const { data, isLoading, isPending, error } = useGetGameQuery();
  const {
    selectedFlags,
    playersTurn,
    winner,
    setSelectedFlags,
    togglePlayerTurn,
    incorrectAnswer,
    setIncorrectAnswer,
    reset,
  } = useGameStore((state) => state);

  useEffect(() => {
    let timeout = null;
    if (playersTurn === 2 && !winner && flags && player === "computer") {
      timeout = setTimeout(() => {
        const computerFlag = determineMove(easyComputer, {
          flags,
          selectedFlags,
          answers: data.answers,
          setIncorrectAnswer,
        });

        if (computerFlag) {
          setSelectedFlags(computerFlag);
        }

        togglePlayerTurn();
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [playersTurn, winner, player]);

  if (isLoading || isPending) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", height: "8rem" }}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) return <p>Error... {error.message}</p>;

  function handleClick(outerIndex: number, innerIndex: number) {
    setSelectedSquare([outerIndex + 1, innerIndex + 1]);
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <Notification
            backgroundColor={
              playersTurn === 1 || winner === 1 ? "#b0ddff" : "#C4FFBF"
            }
          >
            {!!winner ? (
              <Heading variant="h3">
                Player {winner} has won! Congrats!!
              </Heading>
            ) : (
              <Heading variant="h3">
                Player {playersTurn} it's your turn!
              </Heading>
            )}
          </Notification>
          <div style={{ display: "flex" }}>
            <Gameboard
              incorrectAnswer={incorrectAnswer}
              handleClick={handleClick}
              data={data?.game}
              selectedFlags={selectedFlags}
              disabled={
                !!winner || !!(player === "computer" && playersTurn === 2)
              }
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <LinkButton handleClick={reset} to="/" label="Give up!" />
        </div>
      </div>
      <Modal isOpen={!!selectedSquare[0]}>
        <AnswerModalContent
          setIncorrectAnswer={setIncorrectAnswer}
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
