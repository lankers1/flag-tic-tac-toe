import { FaUserFriends, FaArrowLeft, FaGlobeAmericas } from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';

import { LinkButton } from '../../components/common/Buttons/LinkButton';
import { Card } from '../../components/common/Card';
import { Heading } from '../../components/common/Heading';

import styles from './styles.module.scss';
import { Button } from '../../components/common/Buttons/Button';
import { useSearchGameWs } from '../../query-hooks/websockets/useSearchGame';
import { Modal } from '../../components/common/Modal';
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

  function handleToggleLoginModal() {
    navigate('auth/login');
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
            <div className={styles.localButtons}>
              {!user?.loggedIn ? (
                <>
                  <Button
                    size="xlarge"
                    label={
                      <>
                        <IoMdLogIn className={styles.buttonIcons} />
                        {'Login'}
                      </>
                    }
                    handleClick={handleToggleLoginModal}
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
                      <p>{'Search for game'}</p>
                    </>
                  }
                  handleClick={searchForGame}
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
            <div className={styles.localButtons}>
              <LinkButton
                size="xlarge"
                to="/game/local"
                label={
                  <>
                    <FaUserFriends className={styles.buttonIcons} />
                    <p>{'Local Play'}</p>
                  </>
                }
              />
              {/* <LinkButton
                size="xlarge"
                to="/game/computer"
                label={
                  <>
                    <FaRobot className={styles.buttonIcons} />
                    {'Vs Computer'}
                  </>
                }
              /> */}
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
