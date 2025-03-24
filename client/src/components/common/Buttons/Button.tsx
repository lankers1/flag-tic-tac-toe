import styles from './styles.module.scss';
import { ReactNode } from 'react';

type Color = 'blue' | 'green' | 'default';
interface Props {
  label: ReactNode;
  size?: string;
  disabled?: boolean;
  type?: 'reset' | 'button' | 'submit' | undefined;
  handleClick?: () => void;
  color?: Color;
  className?: string;
}

function determineColor(color: Color) {
  switch (color) {
    case 'blue':
      return styles.blue;
    case 'green':
      return styles.green;
    default:
      return '';
  }
}

export const Button = ({
  label,
  size,
  handleClick,
  type = 'button',
  color = 'default',
  disabled = false,
  className = ''
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.button} ${
        size === 'xlarge' && styles.xlarge
      } ${determineColor(color)} ${className}`}
      type={type}
    >
      {label}
    </button>
  );
};
