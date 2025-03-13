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
import { Text } from '@components/common/Text';
import { Leaderboard } from '@components/Leaderboard';
import { FlexDiv } from '@components/common/FlexDiv';
import { OnlineGameSearchModal } from '@components/Home/GameSearchModal';

export const Home = () => {
  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const {
    displayGameSearchModal,
    searchForGame,
    cancelSearch,
    displayAccountSearchingModal,
    closeAccountSearchingModal
  } = useSearchGameWs();

  return (
    <>
      <FlexDiv
        justifyContent="center"
        alignItems="center"
        className={styles.container}
      >
        <Card className={styles.card}>
          <FlexDiv
            justifyContent="center"
            alignItems="center"
            flexDirection="col"
            className={styles.cardContainer}
          >
            <div className={styles.subheading}>
              <Heading variant="h2">Play online</Heading>
              <Text>
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Text>
            </div>
            <FlexDiv className={styles.localButtons}>
              {!user?.loggedIn ? (
                <>
                  <LinkButton
                    to="auth/login"
                    label={
                      <>
                        <IoMdLogIn className={styles.buttonIcons} />
                        <Text fontSize="small">{'Login'}</Text>
                      </>
                    }
                  />
                  <LinkButton
                    to="auth/register"
                    label={
                      <>
                        <FaGlobeAmericas className={styles.buttonIcons} />
                        <Text fontSize="small">{'Register'}</Text>
                      </>
                    }
                  />
                </>
              ) : (
                <>
                  <Button
                    disabled={!!displayGameSearchModal}
                    label={
                      <>
                        <FaGlobeAmericas className={styles.buttonIcons} />
                        Search for game
                      </>
                    }
                    handleClick={searchForGame}
                  />
                  <LinkButton
                    to="/leaderboard/1"
                    label={
                      <>
                        <FaTrophy className={styles.buttonIcons} />
                        Leaderboard
                      </>
                    }
                  />
                </>
              )}
            </FlexDiv>
          </FlexDiv>
        </Card>
        <Card className={styles.card}>
          <FlexDiv
            justifyContent="center"
            alignItems="center"
            flexDirection="col"
            className={styles.cardContainer}
          >
            <div className={styles.subheading}>
              <Heading variant="h2">Play locally</Heading>
              <Text>
                Aim to beat your opponent by guessing the flags based on
                categories. The first to complete three in a row, column or
                diagonally wins.
              </Text>
            </div>
            <FlexDiv className={styles.localButtons}>
              <LinkButton
                to="/game/local"
                label={
                  <>
                    <FaUserFriends className={styles.buttonIcons} />
                    Local Play
                  </>
                }
              />
              <LinkButton
                to="/game/computer"
                label={
                  <>
                    <FaRobot className={styles.buttonIcons} />
                    VS Computer
                  </>
                }
              />
            </FlexDiv>
          </FlexDiv>
        </Card>
      </FlexDiv>
      <OnlineGameSearchModal
        isOpen={displayGameSearchModal}
        cancelSearch={cancelSearch}
      />
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
        <FlexDiv alignItems="center" flexDirection="col">
          <Heading variant="h3">
            You have another tab open searching for a game.
          </Heading>
          <Button
            handleClick={closeAccountSearchingModal}
            label={
              <>
                <FaArrowLeft className={styles.buttonIcons} />
                Cancel
              </>
            }
          />
        </FlexDiv>
      </Modal>
      <Routes>
        <Route
          path="auth/*"
          element={
            <RegisterModal isOpen={true} closeModal={() => navigate('/')} />
          }
        />
      </Routes>
    </>
  );
};
