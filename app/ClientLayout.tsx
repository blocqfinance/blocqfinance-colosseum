"use client";
import usePreventMobileView from "../app/utils/usePreventMobileView";
import { ToastProvider } from "../components/toast/ToastContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  usePreventMobileView();
  return (
    <div>
      <ToastProvider>
        {children}
      </ToastProvider>
    </div>
  );
}
