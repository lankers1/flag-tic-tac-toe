import { FaRobot, FaUserFriends, FaArrowLeft } from 'react-icons/fa';

import { LinkButton } from '../../components/Buttons/LinkButton';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';

import styles from './styles.module.scss';
import { Button } from '../../components/Buttons/Button';
import { useWebsocket } from '../../query-hooks/useWebsocket';
import { Modal } from '../../components/Modal';
import { useState } from 'react';

export const Home = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const toggleDisplayModal = () => setDisplayModal((state) => !state);
  const { searchForGame, cancelSearch } = useWebsocket(toggleDisplayModal);
  return (
    <>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.cardContainer}>
            <div className={styles.subheading}>
              <Heading variant="h3">
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Heading>
            </div>
            <div className={styles.buttons}>
              <Button label="Play online" handleClick={searchForGame} />
              <LinkButton
                size="xlarge"
                to="/game/local"
                label={
                  <>
                    <FaUserFriends className={styles.buttonIcons} />
                    {'Local Play'}
                  </>
                }
              />
              <LinkButton
                size="xlarge"
                to="/game/computer"
                label={
                  <>
                    <FaRobot className={styles.buttonIcons} />
                    {'Vs Computer'}
                  </>
                }
              />
            </div>
          </div>
        </Card>
      </div>
      <Modal isOpen={displayModal}>
        <h3>Searching for game</h3>
        <Button
          handleClick={cancelSearch}
          label={
            <p style={{ gap: '6px', alignItems: 'center', display: 'flex' }}>
              <FaArrowLeft /> Back
            </p>
          }
        />
      </Modal>
    </>
  );
};
