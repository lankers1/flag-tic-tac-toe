import { useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../../components/common/Buttons/Button';
import { Heading } from '../../../../components/common/Heading';
import { Modal } from '../../../../components/common/Modal';

import styles from './styles.module.scss';

interface Props {
  winner: number | null;
  handleResetGame: () => void;
  quitGame: (navigate: NavigateFunction, gameId: string | undefined) => void;
}

export const ActionButtons = ({ winner, handleResetGame, quitGame }: Props) => {
  const { gameId } = useParams();
  const [openModal, setOpenModal] = useState<'give_up' | 'restart' | false>(
    false
  );

  return (
    <div className={styles.container}>
      <Button handleClick={() => setOpenModal('give_up')} label="Give up" />
      {!gameId && (
        <Button
          handleClick={() => setOpenModal('restart')}
          label={
            <>
              <GrPowerReset className={styles.buttonIcon} />
              {winner ? 'Play Again' : 'Reset Game'}
            </>
          }
        />
      )}
      <Modal isOpen={!!openModal}>
        <ModalContent
          type={openModal}
          closeModal={() => setOpenModal(false)}
          handleResetGame={handleResetGame}
          quitGame={quitGame}
        />
      </Modal>
    </div>
  );
};

interface ModalContentProps {
  type: 'give_up' | 'restart' | false;
  closeModal: () => void;
  quitGame: (navigate: NavigateFunction, gameId: string | undefined) => void;
  handleResetGame: () => void;
}

const ModalContent = ({
  type,
  closeModal,
  quitGame,
  handleResetGame
}: ModalContentProps) => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  switch (type) {
    case 'give_up':
      return (
        <>
          <Heading variant="h3">Are you sure you want to give up?</Heading>
          <div className={styles.buttonContainer}>
            <Button handleClick={closeModal} label="No" />
            <Button
              handleClick={() => quitGame(navigate, gameId)}
              label="Yes"
            />
          </div>
        </>
      );
    case 'restart':
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
