import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

interface Props {
  to: string;
  label: string;
  size?: string;
  handleClick?: () => void;
}

export const LinkButton = ({ to, label, size, handleClick }: Props) => {
  return (
    <Link
      onClick={handleClick}
      to={to}
      className={`${styles.linkButton} ${size === "xlarge" && styles.xlarge}`}
    >
      {label}
    </Link>
  );
};
