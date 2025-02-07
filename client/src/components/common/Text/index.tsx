import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  fontSize?: 'small' | 'medium' | 'large';
  color?: 'error';
}

export const Text = ({
  children,
  color,
  fontSize = 'medium'
}: PropsWithChildren<Props>) => {
  const fontSizeClassName = `size-${fontSize}`;
  return (
    <p
      className={`${styles.text} ${color && styles[color]} ${
        styles[fontSizeClassName]
      }`}
    >
      {children}
    </p>
  );
};
