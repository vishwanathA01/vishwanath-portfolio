import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vishwanath Thakur | Software Engineer Portfolio",
  description: "Premium developer portfolio with projects, GitHub, coding profiles and recruiter mode.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}