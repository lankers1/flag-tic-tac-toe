import { useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@components/common/Buttons/Button';
import { Modal } from '@components/common/Modal';
import styles from './styles.module.scss';
import { Text } from '@components/common/Text';

interface Props {
  winner: number | null;
  handleResetGame: () => void;
  quitGame: (navigate: NavigateFunction, type: string) => void;
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
  quitGame: (navigate: NavigateFunction, type: string) => void;
  handleResetGame: () => void;
}

const ModalContent = ({
  type,
  closeModal,
  quitGame,
  handleResetGame
}: ModalContentProps) => {
  const navigate = useNavigate();

  switch (type) {
    case 'give_up':
      return (
        <>
          <Text>Are you sure you want to give up?</Text>
          <div className={styles.buttonContainer}>
            <Button handleClick={closeModal} label="No" />
            <Button handleClick={() => quitGame(navigate, type)} label="Yes" />
          </div>
        </>
      );
    case 'restart':
      return (
        <>
          <Text>Are you sure you want to restart the game?</Text>
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
