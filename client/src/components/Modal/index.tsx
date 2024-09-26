import styles from "./styles.module.scss";

interface Props {
  isOpen: boolean;
}

export const Modal = ({ isOpen }: Props) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}></div>
    </div>
  );
};
