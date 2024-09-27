import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

interface Props {
  isOpen: boolean;
}

export const Modal = ({ isOpen, children }: PropsWithChildren<Props>) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};
