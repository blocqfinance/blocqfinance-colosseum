"use client";
import usePreventMobileView from "./utils/usePreventMobileView";
import { ToastProvider } from "../components/toast/ToastContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  usePreventMobileView();
  return (
    <div>
        {children}
    </div>
  );
}
