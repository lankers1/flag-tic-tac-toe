import * as flags from 'country-flag-icons/react/1x1';
import styles from './styles.module.scss';

interface Props {
  flagIso2: string;
  className?: string;
}

export const FlagAvatar = ({ flagIso2, className }: Props) => {
  const Flag = flags?.[flagIso2 as keyof typeof flags];

  return <Flag className={`${styles.flagAvatar} ${className && className}`} />;
};
