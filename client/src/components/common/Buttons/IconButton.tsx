import { IconType } from "react-icons";

import styles from "./styles.module.scss";

interface Props {
  handleClick: () => void;
  height?: string;
  width?: string;
  Icon: IconType;
}

export const IconButton = ({
  handleClick,
  height = "1.25rem",
  width = "1.25rem",
  Icon,
}: Props) => (
  <button onClick={handleClick} className={styles.iconButton}>
    <Icon
      className={styles.icon}
      style={{
        height,
        width,
      }}
    />
  </button>
);
