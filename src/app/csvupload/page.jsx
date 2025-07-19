import React from 'react'
import CSVUploadPage from './CSVUpload'

export const metadata = {
 title: "Upload CSV – Startlytics | Visualize Your Data Instantly",
  description:
    "Easily upload your CSV files to Startlytics and generate powerful, interactive charts and dashboards. No coding required, just drag, drop, and visualize.",
  keywords: [
    "CSV upload tool",
    "upload CSV file",
    "data visualization from CSV",
    "Startlytics CSV dashboard",
    "no-code data analysis",
    "generate charts from CSV",
    "interactive dashboard CSV",
    "CSV analytics tool",
  ],
  openGraph: {
    title: "Startlytics Dashboard",
    description:
      "Upload your CSV or connect Google Sheets to visualize analytics on an interactive dashboard.",
    url: "https://startlytics-gi2w.vercel.app/csvupload",
    siteName: "Startlytics",
    images: [
      {
        url: "https://startlytics-gi2w.vercel.app/images/1.png", 
        width: 1200,
        height: 630,
        alt: "Startlytics Csv Upload",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startlytics Csv Upload",
    description:
      "Analyze your CSV or Google Sheets data easily with Startlytics.",
    images: ["https://startlytics-gi2w.vercel.app/images/1.png"],
  },
};

const CSVUpload = () => {
  return (
    <>
      <CSVUploadPage/>
    </>
  )
}

export default CSVUpload