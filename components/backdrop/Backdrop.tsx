import React, { ReactNode, HTMLAttributes } from "react";
import styles from "./Backdrop.module.scss";

interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({ children, ...props }) => {
  return (
    <div {...props} className={styles.backdrop}>
      {children}
    </div>
  );
};

export default Backdrop;