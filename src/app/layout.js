import { AuthProvider } from "./Providers";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KraToo",
  description: "StaywithtatarJohnydeffOnetap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SpeedInsights />
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}