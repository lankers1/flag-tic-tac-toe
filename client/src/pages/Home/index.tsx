import { useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  FaUserFriends,
  FaArrowLeft,
  FaGlobeAmericas,
  FaTrophy,
  FaRobot
} from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';

import { LinkButton } from '../../components/common/Buttons/LinkButton';
import { Card } from '../../components/common/Card';
import { Heading } from '../../components/common/Heading';

import styles from './styles.module.scss';
import { Button } from '../../components/common/Buttons/Button';
import { useSearchGameWs } from '../../query-hooks/websockets/useSearchGame';
import { Modal } from '../../components/common/Modal';
import { RegisterModal } from '@components/Auth/RegisterModal';
import { AuthContext } from '../..//context/AuthContext';
import { Loader } from '@components/common/Loader';
import { Text } from '@components/common/Text';
import { Leaderboard } from '@pages/Leaderboard';

export const Home = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    displaySearchModal,
    searchForGame,
    cancelSearch,
    displayAccountSearchingModal,
    closeAccountSearchingModal
  } = useSearchGameWs();

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
              <Text>
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Text>
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
                <>
                  <Button
                    size="xlarge"
                    disabled={!!displaySearchModal}
                    label={
                      <>
                        <FaGlobeAmericas className={styles.buttonIcons} />
                        <Text fontSize="small">{'Search for game'}</Text>
                      </>
                    }
                    handleClick={searchForGame}
                  />
                  <LinkButton
                    size="xlarge"
                    to="/leaderboard/1"
                    label={
                      <>
                        <FaTrophy className={styles.buttonIcons} />
                        <Text fontSize="small">{'Leaderboard'}</Text>
                      </>
                    }
                  />
                </>
              )}
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className={styles.cardContainer}>
            <div className={styles.subheading}>
              <Heading variant="h2">Play locally</Heading>
              <Text>
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Text>
            </div>
            <div className={styles.localButtons}>
              <LinkButton
                size="xlarge"
                to="/game/local"
                label={
                  <>
                    <FaUserFriends className={styles.buttonIcons} />
                    <Text fontSize="small">{'Local Play'}</Text>
                  </>
                }
              />
              <LinkButton
                size="xlarge"
                to="/game/computer"
                label={
                  <>
                    <FaRobot className={styles.buttonIcons} />
                    <Text fontSize="small">{'VS Computer'}</Text>
                  </>
                }
              />
            </div>
          </div>
        </Card>
      </div>
      <Modal isOpen={displaySearchModal}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Heading variant="h3">Searching for game</Heading>
          <div style={{ width: '5rem', display: 'flex', padding: '1rem 0' }}>
            <Loader />
          </div>
          <Button
            handleClick={cancelSearch}
            label={
              <>
                <FaArrowLeft className={styles.buttonIcons} />
                <Text>Cancel</Text>
              </>
            }
          />
        </div>
      </Modal>
      <Routes>
        <Route
          path="leaderboard/:page"
          element={
            <Modal isOpen={true} height="80%">
              <Leaderboard />
            </Modal>
          }
        />
      </Routes>
      <Modal isOpen={displayAccountSearchingModal}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Heading variant="h3">
            You have another tab open searching for a game.
          </Heading>
          <Button
            handleClick={closeAccountSearchingModal}
            label={
              <>
                <FaArrowLeft className={styles.buttonIcons} />
                <Text>Cancel</Text>
              </>
            }
          />
        </div>
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
