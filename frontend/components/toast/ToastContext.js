"use client";
import React, { createContext, useContext, useState } from "react";
import styles from "./toast.module.scss";
import Image from "next/image";
import gsap from "gsap";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (variant, message) => {
    setToast({ variant, message });
    gsap.to("." + styles.container, {
      duration: 0,
      display: "block",
    });
    gsap.to("." + styles.container, {
      delay: 0.01,
      duration: 0.51,
      transform: "translateX(0)",
      onComplete: () => setTimeout(() => hideToast(null), 5200),
    });
  };

  const hideToast = () => {
    gsap.to("." + styles.container, {
      delay: 0,
      duration: 0.5,
      transform: "translateX(110%)",
    });

    gsap.to("." + styles.container, {
      delay: 0.51,
      duration: 0,
      display: "block",
    });

    setTimeout(() => setToast(null), 1100);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className={styles.container + " " + styles[toast?.variant]}>
        <div className={styles.top}>
          <div className={styles.top_left}>
            <div>
              {toast?.variant && (
                <Image
                  src={`/toast/${toast?.variant}.svg`}
                  width={40}
                  height={40}
                  alt="icon"
                />
              )}
            </div>
            <div className={styles.message}>{toast?.message}</div>
          </div>
          <div className={styles.top_right} onClick={hideToast}>
            <Image src={`/close-toast.svg`} width={28} height={28} alt="" />
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
};
