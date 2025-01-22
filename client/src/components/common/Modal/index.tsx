import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  isOpen: boolean;
  height?: string;
}

export const Modal = ({
  isOpen,
  children,
  height
}: PropsWithChildren<Props>) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackground} style={{ height }}>
      <dialog className={styles.modal} open={isOpen}>
        {children}
      </dialog>
    </div>
  );
};
