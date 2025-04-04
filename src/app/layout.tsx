import type { Metadata } from "next";
import "./globals.css";
import { Pixelify_Sans, Roboto } from "next/font/google";
import Script from "next/script";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";

const pixel = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  openGraph: {
    title: "Castle Quest",
    description: "Gamified Captcha",
    url: "https://game-captcha.vercel.app/",
    siteName: "Castle Quest",
    images: [
      {
        url: "https://res.cloudinary.com/djwhxlpk5/image/upload/v1743797897/Screenshot_59_nmmrrr.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  title: "Castle Quest",
  generator: "Next.js",
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
      <body className={`${pixel.className} antialiased`}>
        {children} <GoogleAnalytics gaId="G-51X5W7SDHX" />
      </body>
    </html>
  );
}
