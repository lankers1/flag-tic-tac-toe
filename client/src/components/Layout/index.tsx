import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";

export const Layout = () => {
  return (
    <main className={styles.layout}>
      <Outlet />
    </main>
  );
};
