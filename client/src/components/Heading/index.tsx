import { createElement, PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = ({ variant, children }: PropsWithChildren<Props>) => {
  return createElement(
    variant,
    { className: styles[`${variant}Heading`] },
    children
  );
};
