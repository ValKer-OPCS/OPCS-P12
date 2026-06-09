import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.scss";
import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


const montserratMono = Montserrat({
  variable: "--font-montserrat-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ValKer.dev"),
  title: "ValKer - Portfolio",
  description: "Site Portfolio de ValKer",
  keywords: ["Développeur Web", "React", "Next.js", "Portfolio", "Frontend"],
  authors: [{ name: "ValKer" }],
  creator: "ValKer",

  openGraph: {
    title: "ValKer — Développeur Web",
    description: "Découvrez mes projets, compétences et expériences.",
    url: "https://ValKer.dev",
    siteName: "Portfolio ValKer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio de ValKer",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ValKer — Développeur Web",
    description: "Portfolio de ValKer, développeur web.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserratMono.variable}>
      <body className={inter.variable} >
      <AuthProvider>
        <div className="app">
          <Header />
          {children}
          <Footer />
        </div>
      </AuthProvider>
      </body>
    </html>
  );
}
