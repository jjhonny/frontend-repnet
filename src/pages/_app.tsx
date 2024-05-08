import { AuthProvider } from "@/contexts/AuthContex";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
