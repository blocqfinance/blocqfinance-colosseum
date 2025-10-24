"use client";
// usePreventMobileView.js

import { useEffect } from "react";

export default function usePreventMobileView() {
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;font-family:sans-serif;">
          <h2>Mobile view is not supported</h2>
          <p>Please visit this app from a desktop or laptop.</p>
        </div>
      `;
    }
  }, []);
}
