import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fund-Circle - Help creators",
  description: "This website is crowdfunding for creators",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen flex flex-col overflow-hidden">

        <SessionWrapper>

          <Navbar />

          <div className="absolute inset-0 -z-10 bg-black"></div>

          {/* Added "flex flex-col" so the Home component can stretch inside it */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>

        </SessionWrapper>
      </body>
    </html>
  );
}
