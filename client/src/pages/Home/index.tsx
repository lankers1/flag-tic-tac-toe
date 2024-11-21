import { FaRobot, FaUserFriends } from 'react-icons/fa';

import { LinkButton } from '../../components/Buttons/LinkButton';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';

import styles from './styles.module.scss';

export const Home = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.cardContainer}>
          <div className={styles.subheading}>
            <Heading variant="h2">Play!</Heading>
            <Heading variant="h3">
              NEW VERSION v.212 Aim to beat your opponent by guessing the flags
              based on categories. The first to complete three in a row, column
              or diagonally wins.
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
  );
};
