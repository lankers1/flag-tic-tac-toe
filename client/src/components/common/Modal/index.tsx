import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  isOpen: boolean;
  height?: string;
  className?: string;
}

export const Modal = ({
  isOpen,
  children,
  height,
  className
}: PropsWithChildren<Props>) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackground}>
      <dialog
        className={`${styles.modal} ${className}`}
        style={{ height }}
        open={isOpen}
      >
        {children}
      </dialog>
    </div>
  );
};
