import { AuthProvider } from "@/contexts/AuthContex";
import { CartProvider } from "@/contexts/CartContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}
