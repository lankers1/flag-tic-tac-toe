import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

interface Props {
  to: string;
  label: string;
  handleClick: () => void;
}

export const LinkButton = ({ to, label, handleClick }: Props) => {
  return (
    <Link onClick={handleClick} to={to} className={styles.linkButton}>
      {label}
    </Link>
  );
};
