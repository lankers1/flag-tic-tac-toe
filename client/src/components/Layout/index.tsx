import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import { Heading } from "../Heading";

export const Layout = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading variant="h1">Flag tic-tac-toe</Heading>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
