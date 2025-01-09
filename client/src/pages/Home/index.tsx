import {
  FaRobot,
  FaUserFriends,
  FaArrowLeft,
  FaGlobeAmericas
} from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';

import { LinkButton } from '../../components/Buttons/LinkButton';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';

import styles from './styles.module.scss';
import { Button } from '../../components/Buttons/Button';
import { useSearchGameWs } from '../../query-hooks/useSearchGameWs';
import { Modal } from '../../components/Modal';
import { useContext, useState } from 'react';
import { RegisterModal } from '@components/Auth/RegisterModal';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AuthContext } from '../..//context/AuthContext';

export const Home = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayModal, setDisplayModal] = useState(false);
  const toggleDisplayModal = () => setDisplayModal((state) => !state);
  const { searchForGame, cancelSearch } = useSearchGameWs(toggleDisplayModal);

  function handleToggleRegisterModal() {
    navigate('auth/register');
  }
  return (
    <>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.cardContainer}>
            <div className={styles.subheading}>
              <Heading variant="h2">Play online</Heading>
              <Heading variant="h3">
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Heading>
            </div>
            <div className={styles.buttons}>
              {!user.loggedIn ? (
                <>
                  <Button
                    size="xlarge"
                    label={
                      <>
                        <IoMdLogIn className={styles.buttonIcons} />
                        {'Login'}
                      </>
                    }
                    handleClick={searchForGame}
                  />
                  <Button
                    size="xlarge"
                    label={
                      <>
                        <FaGlobeAmericas className={styles.buttonIcons} />
                        {'Register'}
                      </>
                    }
                    handleClick={handleToggleRegisterModal}
                  />
                </>
              ) : (
                <Button
                  size="xlarge"
                  label={
                    <>
                      <FaGlobeAmericas className={styles.buttonIcons} />
                      {'Search for game'}
                    </>
                  }
                  // handleClick={handleToggleRegisterModal}
                />
              )}
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className={styles.cardContainer}>
            <div className={styles.subheading}>
              <Heading variant="h2">Play locally</Heading>
              <Heading variant="h3">
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Heading>
            </div>
            <div className={styles.buttons}>
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
      <Routes>
        <Route
          path="auth/*"
          element={
            <RegisterModal
              isOpen={true}
              closeModal={handleToggleRegisterModal}
            />
          }
        />
      </Routes>
    </>
  );
};
