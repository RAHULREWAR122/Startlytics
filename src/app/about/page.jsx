import React from 'react';
import AboutPage from './About';

export const metadata = {
  title: "About | Startlytics - Data Made Simple",
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
  metadataBase: new URL("https://startlytics-gi2w.vercel.app"),
  openGraph: {
    title: "About | Startlytics - Data Made Simple",
    description:
      "Instant dashboards and insights from your CSV files. Drag, drop, or paste a link to get started.",
    url: "https://startlytics-gi2w.vercel.app/about",
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
    title: "About | Startlytics - Data Made Simple",
    description:
      "Drag and drop your CSV or paste a link. Get clean, automated dashboards instantly.",
    images: ["/images/1.png" , "/images/2.png" , "/images/3.png"],
    creator: "@startlytics",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://startlytics-gi2w.vercel.app",
  },
};

export default function About() {
  return <AboutPage />;
}