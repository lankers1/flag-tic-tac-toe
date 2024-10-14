import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { LinkButton } from "../../../../components/Buttons/LinkButton";
import { Button } from "../../../../components/Buttons/Button";
import { Heading } from "../../../../components/Heading";
import { Modal } from "../../../../components/Modal";

import styles from "./styles.module.scss";

interface Props {
  winner: number | null;
  handleResetGame: () => void;
  resetQuery: () => void;
}

export const ActionButtons = ({
  winner,
  handleResetGame,
  resetQuery,
}: Props) => {
  const [displayGiveUpModal, setDisplayGiveUpModal] = useState(false);
  const [displayRestartGameModal, setDisplayRestartGameModal] = useState(false);

  return (
    <div className={styles.container}>
      <Button handleClick={() => setDisplayGiveUpModal(true)} label="Give up" />
      <Button
        handleClick={() => setDisplayRestartGameModal(true)}
        label={
          <>
            <GrPowerReset className={styles.buttonIcon} />
            {winner ? "Play Again" : "Reset Game"}
          </>
        }
      />
      <Modal isOpen={displayGiveUpModal}>
        <Heading variant="h3">Are you sure you want to give up?</Heading>
        <div className={styles.buttonContainer}>
          <Button handleClick={() => setDisplayGiveUpModal(false)} label="No" />
          <LinkButton handleClick={resetQuery} to="/" label="Yes" />
        </div>
      </Modal>
      <Modal isOpen={displayRestartGameModal}>
        <Heading variant="h3">
          Are you sure you want to restart the game?
        </Heading>
        <div className={styles.buttonContainer}>
          <Button
            handleClick={() => setDisplayRestartGameModal(false)}
            label="No"
          />
          <Button
            handleClick={() => {
              setDisplayRestartGameModal(false);
              handleResetGame();
            }}
            label="yes"
          />
        </div>
      </Modal>
    </div>
  );
};
