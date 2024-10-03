import { ReactElement } from "react";

import styles from "./styles.module.scss";

interface Props {
  content: string | number | ReactElement;
  handleClick: () => void;
  clickable?: boolean;
}

export const ListItem = ({
  content,
  handleClick,
  clickable = false,
}: Props) => {
  return (
    <li
      className={`${styles.listItem} ${clickable && styles.clickable}`}
      onClick={clickable && handleClick}
    >
      {content}
    </li>
  );
};
