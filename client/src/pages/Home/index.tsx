import { LinkButton } from "../../components/Buttons/LinkButton";
import { Card } from "../../components/Card";

import styles from "./styles.module.scss";

export const Home = () => {
  return (
    <>
      <header>
        <h1
          style={{ fontWeight: 400, letterSpacing: ".2rem", fontSize: "64px" }}
        >
          Flag tic-tac-toe
        </h1>
        <h4
          style={{
            fontSize: "32px",
            fontWeight: 400,
            width: "75%",
            lineHeight: "normal",
          }}
        >
          Aim to beat your opponent by guessing the flags based on categories.
          The first to complete three in a row, column or diagonally wins.
        </h4>
      </header>
      <div
        style={{
          display: "flex",
          gap: "120px",
          justifyContent: "space-between",
        }}
      >
        <Card className={styles.cards}>
          <h2
            style={{
              fontWeight: 400,
              fontSize: "32px",
            }}
          >
            Play versus a player
          </h2>
        </Card>
        <Card className={styles.cards}>
          <h2
            style={{
              fontWeight: 400,
              fontSize: "32px",
              marginBottom: "1rem",
            }}
          >
            Play versus computer
          </h2>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "40%",
                height: "280px",
                backgroundColor: "grey",
              }}
            >
              placeholder image
            </div>
            <div
              style={{
                flex: 1,
                paddingLeft: "1rem",
                display: "flex",
                fontSize: "20px",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ paddingBottom: "1rem" }}>
                Practice against the computer. Choose your difficulty, which
                determines the categories generated. If you think you’re good
                enough, try EXTREME mode! Good luck
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <LinkButton to="/game" label="Go!" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
