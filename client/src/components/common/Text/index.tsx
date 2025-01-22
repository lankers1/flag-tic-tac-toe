import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  fontSize?: 'small' | 'medium' | 'large';
}

export const Text = ({
  children,
  fontSize = 'medium'
}: PropsWithChildren<Props>) => {
  const fontSizeClassName = `size-${fontSize}`;
  return (
    <p className={`${styles.text} ${styles[fontSizeClassName]}`}>{children}</p>
  );
};
