import { ReactElement } from "react";

import styles from "./styles.module.scss";

interface Props {
  content: string | number | ReactElement;
  handleClick: () => void;
}

export const ListItem = ({ content, handleClick }: Props) => {
  return (
    <li className={styles.listItem} onClick={handleClick}>
      {content}
    </li>
  );
};
