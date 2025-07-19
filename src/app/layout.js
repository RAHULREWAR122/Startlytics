import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import CursorLightEffect from "@/Pages/CursorEffect/CursorEffect";
import "./globals.css";
import { Inter } from 'next/font/google'
import ReduxProvider from "@/components/Redux/Provider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Home/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ChatAi from "@/Pages/ChatAi/ChatAi";
import ChatAi from "@/components/ChatAi/ChatAi";
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: "Startlytics - Analytics Platform for Smart Founders",
  description:
    "Startlytics is a powerful platform that helps you visualize, analyze, and understand your CSV data effortlessly. Upload or link your file and get instant dashboards.",
  keywords: [
    "Startlytics",
    "Data dashboard",
    "CSV analytics",
    "data visualization",
    "upload CSV",
    "CSV to chart",
    "Data SaaS",
    "Startlytics dashboard",
  ],
  metadataBase: new URL("https://startlytics-gi2w.vercel.app/"),
  openGraph: {
    title: "Startlytics",
    description:
      "Instant dashboards and insights from your CSV files. Drag, drop, or paste a link to get started.",
    url: "https://startlytics-gi2w.vercel.app/",
    siteName: "Startlytics",
    images: [
      {
        url: "/images/logo.svg", 
        width: 1200,
        height: 630,
        alt: "Startlytics Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startlytics",
    description:
      "Drag and drop your CSV or paste a link. Get clean, automated dashboards instantly.",
    images: ["/images/1.png" , "/images/2.png" , "/images/3.png"],
    creator: "@startlytics",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://startlytics-gi2w.vercel.app/" />
      </head>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} custom_scrollbar font-inter`}
      >
        <ReduxProvider>
          <Analytics />
          <CursorLightEffect />
          <Navbar />
          {children}
          <ToastContainer />
          <ChatAi />
          <Footer />
        </ReduxProvider>

        {/* Fixed Script component with required id attribute */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Startlytics",
              url: "https://startlytics-gi2w.vercel.app",
              logo: "https://startlytics-gi2w.vercel.app/images/logo.svg",
              sameAs: ["https://www.linkedin.com/in/rahul-rewar-202517276/"],
              description:
                "Startlytics helps users analyze CSV files and generate dashboards effortlessly.",
            }),
          }}
        />
      </body>
    </html>
  );
}
