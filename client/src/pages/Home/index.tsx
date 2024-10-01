import { LinkButton } from "../../components/Buttons/LinkButton";
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";

import styles from "./styles.module.scss";

export const Home = () => {
  return (
    <>
      <div className={styles.subheading}>
        <Heading variant="h2">
          Aim to beat your opponent by guessing the flags based on categories.
          The first to complete three in a row, column or diagonally wins.
        </Heading>
      </div>
      <div className={styles.cardContainer}>
        <Card className={styles.cards}>
          <Heading variant="h2">Play versus a player</Heading>
        </Card>
        <Card className={styles.cards}>
          <Heading variant="h2">Play versus computer</Heading>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "40%",
                height: "200px",
                backgroundColor: "grey",
              }}
            >
              placeholder image
            </div>
            <div className={styles.cardRightColumn}>
              <p>
                Practice against the computer. Choose your difficulty, which
                determines the categories generated. If you think you’re good
                enough, try EXTREME mode! Good luck
              </p>
              <div className={styles.buttonContainer}>
                <LinkButton to="/game" label="Go!" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
