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
import { Card } from "../../components/Card";
import { List } from "../../components/List";
import { ListItem } from "../../components/List/ListItem";

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
    incorrectAnswers,
    setIncorrectAnswers,
  } = useGameStore((state) => state);

  useEffect(() => {
    if (playersTurn === 2 && !winner && flags) {
      setTimeout(() => {
        const computerFlag = determineMove(easyComputer, {
          flags,
          selectedFlags,
          answers: data.answers,
          setIncorrectAnswers,
        });

        if (computerFlag) {
          setSelectedFlags(computerFlag);
        }

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
      <div className={styles.container}>
        <Notification
          backgroundColor={
            playersTurn === 1 || winner === 1 ? "#b0ddff" : "#9dff94"
          }
        >
          {!!winner ? (
            <Heading variant="h3">Player {winner} has won! Congrats!!</Heading>
          ) : (
            <Heading variant="h3">Player {playersTurn} it's your turn!</Heading>
          )}
        </Notification>
        <Gameboard
          handleClick={handleClick}
          data={data?.game}
          selectedFlags={selectedFlags}
          disabled={!!winner}
        />
        {/* <div>
          <Notification
            backgroundColor={
              playersTurn === 1 || winner === 1 ? "#b0ddff" : "#9dff94"
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
          <Card backgroundColor="white" className={styles.playerCards}>
            <Heading variant="h3">Incorrect answers</Heading>
            <List>
              {incorrectAnswers.map((answer) => (
                <ListItem content={answer.name} />
              ))}
            </List>
          </Card>
        </div> */}
      </div>
      <LinkButton to="/" label="Give up!" />
      <Modal isOpen={!!selectedSquare[0]}>
        <AnswerModalContent
          setIncorrectAnswers={setIncorrectAnswers}
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
