import type { Metadata } from "next";
import "./globals.css";
import { Yusei_Magic } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

const magic = Yusei_Magic({
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
      <head>
        <Script
          id="eslint_id_3053"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-51X5W7SDHX"
        ></Script>
        <Script id="eslint_id_3052">{` window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-51X5W7SDHX');`}</Script>
      </head>
      <body className={`${magic.className} antialiased`}>
        {children} <GoogleAnalytics gaId="G-51X5W7SDHX" />
      </body>
    </html>
  );
}
