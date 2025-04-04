import type { Metadata } from "next";
import "./globals.css";
import { Pixelify_Sans, Roboto } from "next/font/google";
import Script from "next/script";
import Head from "next/head";

const pixel = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Castle Quest",
  description: "Gamified Captcha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-51X5W7SDHX"
        ></Script>
        <Script>{` window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-51X5W7SDHX');`}</Script>
      </Head>
      <body className={`${pixel.className} antialiased`}>{children}</body>
    </html>
  );
}
