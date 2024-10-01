import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const Notification = ({
  children,
  backgroundColor,
}: PropsWithChildren<{ backgroundColor?: string }>) => {
  return (
    <div style={{ backgroundColor }} className={styles.notification}>
      {children}
    </div>
  );
};
