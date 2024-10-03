import { LinkButton } from "../../components/Buttons/LinkButton";
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";

import styles from "./styles.module.scss";

export const Home = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.subheading}>
        <Heading variant="h3">
          Aim to beat your opponent by guessing the flags based on categories.
          The first to complete three in a row, column or diagonally wins.
        </Heading>
      </div>
      <div className={styles.cardContainer}>
        <Card backgroundColor="#9dff94" className={styles.cards}>
          <Heading variant="h2">Play versus local</Heading>
          <div className={styles.cardContentContainer}>
            <div className={styles.cardRightColumn}>
              <p>
                Practice against the computer. Choose your difficulty, which
                determines the categories generated. If you think you’re good
                enough, try EXTREME mode! Good luck
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  backgroundColor: "grey",
                  flex: 1,
                  marginBottom: "1rem",
                }}
              >
                <Heading variant="h3">placeholder image</Heading>
              </div>
              <div className={styles.buttonContainer}>
                <LinkButton to="/game" label="Go!" />
              </div>
            </div>
          </div>
        </Card>
        <Card className={styles.cards}>
          <Heading variant="h2">Play versus computer</Heading>
          <div className={styles.cardContentContainer}>
            <div className={styles.cardRightColumn}>
              <p>
                Practice against the computer. Choose your difficulty, which
                determines the categories generated. If you think you’re good
                enough, try EXTREME mode! Good luck
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  backgroundColor: "grey",
                  flex: 1,
                  marginBottom: "1rem",
                }}
              >
                <Heading variant="h3">placeholder image</Heading>
              </div>
              <div className={styles.buttonContainer}>
                <LinkButton to="/game" label="Go!" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
