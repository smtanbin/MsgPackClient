import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import ClientShell from "./client/ClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pack Tester - API Testing Tool with Pack Tester Support",
  description: "Test APIs with Pack Tester encoding/decoding. Fast, modern API testing client with built-in Pack Tester support. Encode, decode, and test your APIs with ease.",
  keywords: ["Pack Tester", "API testing", "MsgPack", "binary serialization", "API client", "developer tools", "JSON alternative", "Pack Tester", "packtester.online"],
  authors: [{ name: "Tanbin Hassan Bappi" }],
  creator: "Tanbin Hassan Bappi",
  publisher: "Pack Tester",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://packtester.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Pack Tester - API Testing Tool",
    description: "Test APIs with Pack Tester encoding/decoding. Fast, modern API testing client with built-in Pack Tester support.",
    url: "https://packtester.online",
    siteName: "Pack Tester",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pack Tester - API Testing Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pack Tester - API Testing Tool",
    description: "Test APIs with Pack Tester encoding/decoding. Fast, modern API testing client.",
    images: ["/og-image.png"],
    creator: "@SilentTanbin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pack Tester",
    "description": "API testing tool with Pack Tester support for encoding and decoding binary data",
    "url": "https://packtester.online",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Tanbin Hassan Bappi",
      "url": "https://github.com/smtanbin"
    },
    "featureList": [
      "Pack Tester encoding/decoding",
      "API testing interface",
      "Environment variables management",
      "Real-time request/response inspection"
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Pack Tester" />
        <meta name="theme-color" content="#007BFF" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
