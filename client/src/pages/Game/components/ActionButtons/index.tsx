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
  const [openModal, setOpenModal] = useState<string | boolean>(false);

  return (
    <div className={styles.container}>
      <Button handleClick={() => setOpenModal("give_up")} label="Give up" />
      <Button
        handleClick={() => setOpenModal("restart")}
        label={
          <>
            <GrPowerReset className={styles.buttonIcon} />
            {winner ? "Play Again" : "Reset Game"}
          </>
        }
      />
      <Modal isOpen={!!openModal}>
        <ModalContent
          type={openModal}
          closeModal={() => setOpenModal(false)}
          handleResetGame={handleResetGame}
          resetQuery={resetQuery}
        />
      </Modal>
    </div>
  );
};

interface ModalContentProps {
  type: "give_up" | "restart";
  closeModal: () => void;
  resetQuery: () => void;
  handleResetGame: () => void;
}

const ModalContent = ({
  type,
  closeModal,
  resetQuery,
  handleResetGame,
}: ModalContentProps) => {
  switch (type) {
    case "give_up":
      return (
        <>
          <Heading variant="h3">Are you sure you want to give up?</Heading>
          <div className={styles.buttonContainer}>
            <Button handleClick={closeModal} label="No" />
            <LinkButton handleClick={resetQuery} to="/" label="Yes" />
          </div>
        </>
      );
    case "restart":
      return (
        <>
          <Heading variant="h3">
            Are you sure you want to restart the game?
          </Heading>
          <div className={styles.buttonContainer}>
            <Button handleClick={closeModal} label="No" />
            <Button
              handleClick={() => {
                closeModal();
                handleResetGame();
              }}
              label="Yes"
            />
          </div>
        </>
      );
    default:
      return;
  }
};
