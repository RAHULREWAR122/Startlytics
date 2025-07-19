import React from 'react'
import GoogleSheetsUpload from './GoogleSheetUpload'

export const metadata = {
  title: "Google Sheet Upload – Startlytics | Turn Spreadsheets into Smart Dashboards",
  description:
    "Connect your Google Sheets with Startlytics using a shareable link and transform your spreadsheet data into insightful dashboards in seconds.",
  keywords: [
    "Google Sheet dashboard",
    "visualize Google Sheets",
    "Google Sheets to dashboard",
    "Google Sheets analytics tool",
    "connect Google Sheets",
    "spreadsheet data visualization",
    "link Google Sheets to dashboard",
    "Startlytics Google Sheets integration",
  ],
  openGraph: {
    title: "Startlytics GoogleSheets Link Upload",
    description:
      "Upload your CSV or connect Google Sheets to visualize analytics on an interactive dashboard.",
    url: "https://startlytics-gi2w.vercel.app/googlesheet",
    siteName: "Startlytics",
    images: [
      {
        url: "https://startlytics-gi2w.vercel.app/images/2.png", 
        width: 1200,
        height: 630,
        alt: "Startlytics GoogleSheets Upload",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startlytics Link Upload",
    description:
      "Analyze your CSV or Google Sheets data easily with Startlytics.",
    images: ["https://startlytics-gi2w.vercel.app/images/2.png"],
  },
};

const GoogleSheetUpload = () => {
  return (
    <>
     <GoogleSheetsUpload/>
    </>
  )
}

export default GoogleSheetUpload 