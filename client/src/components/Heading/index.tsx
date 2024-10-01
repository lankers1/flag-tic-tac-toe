import { createElement, PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export const Heading = ({
  variant,
  children,
  className,
}: PropsWithChildren<Props>) => {
  return createElement(
    variant,
    { className: `${styles[`${variant}Heading`]} ${className}` },
    children
  );
};
