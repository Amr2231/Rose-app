import { Toaster } from "../ui/toaster";
import ReactQueryProvider from "./components/react-query-provider";
import { ToastContextProvider } from "@/context/toast-context";
import SessionProviderWrapper from "./components/session-provider";
import { ThemeProviders } from "./components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviders>
      <ReactQueryProvider>
        <SessionProviderWrapper>
          <ToastContextProvider>
            {children}
            <Toaster />
          </ToastContextProvider>
        </SessionProviderWrapper>
      </ReactQueryProvider>
    </ThemeProviders>
  );
}