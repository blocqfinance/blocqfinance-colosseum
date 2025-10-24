"use client";
import React, { useEffect, useState } from "react";
import { PinInput } from "react-input-pin-code";
import styles from "./otp.module.scss";
import Image from "next/image";

interface OtpProps {
  onSubmit: (otp: string) => void;
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
  showOtp: boolean;
  close?: () => void; 
  email: string | undefined;
}

const Otp: React.FC<OtpProps> = ({
  onSubmit,
  setShowOtp,
  showOtp,
  // submit,
  close,
  email,
}) => {
  const [values, setValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (showOtp && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) return prevTimer - 1;
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, timer]);

  const handleResendClick = () => {
    setTimer(30);
    setResendDisabled(true);
    // submit();
  };

  const handleSubmit = (otp: string) => {
    onSubmit(otp);
  };

  const onChange = (value: string | string[], index: number, values: string[]) => {
    setValues(values);
    const otp = values.join("");

    if (otp.length === 6) {
      handleSubmit(otp);
    }
  };

  return (
    <div className={styles.otp}>
      <div className={styles.otp__header}>
        <h6>
          Please enter the verification code <br /> sent to {email} your email
          address
        </h6>
        <Image
          width={30}
          height={40}
          onClick={() => setShowOtp(false)}
          className={styles.img2}
          src="/close-icon-black.svg"
          alt="close"
        />
      </div>

      <div className={styles.otp__main}>
        <p>
          Please enter the 6-digit verification code sent to {email}, enter it
          below.
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          <PinInput
            values={values}
            size="lg"
            onChange={onChange}
            placeholder=""
            autoTab
          />
        </form>

        <h6>
          Didnt receive the email?{" "}
          <span>
            {timer > 0 ? (
              `${Math.floor(timer / 60)}:${
                timer % 60 < 10 ? "0" + (timer % 60) : timer % 60
              }`
            ) : !resendDisabled ? (
              <button onClick={handleResendClick}>Click to resend</button>
            ) : null}
          </span>
        </h6>
      </div>
    </div>
  );
};

export default Otp;
