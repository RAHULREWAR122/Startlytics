import React from 'react'
import Dashboard from './Dashboard'

export const metadata = {
  title: "Startlytics | Your Smart Data Dashboard",
  description:
    "Visualize your data from CSV or Google Sheets in an intuitive dashboard. Startlytics makes analytics simple and powerful.",
  keywords: [
    "Startlytics",
    "CSV Dashboard",
    "Google Sheets Dashboard",
    "Data Analytics",
    "Data Visualization",
    "Smart Dashboard",
  ],
  openGraph: {
    title: "Startlytics Dashboard",
    description:
      "Upload your CSV or connect Google Sheets to visualize analytics on an interactive dashboard.",
    url: "https://startlytics-gi2w.vercel.app/dashboard",
    siteName: "Startlytics",
    images: [
      {
        url: "https://startlytics-gi2w.vercel.app/images/3.png", 
        width: 1200,
        height: 630,
        alt: "Startlytics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startlytics Dashboard",
    description:
      "Analyze your CSV or Google Sheets data easily with Startlytics.",
    images: ["https://startlytics-gi2w.vercel.app/images/1.png"],
  },
};


const MainDashboard = ({})=> {
  return (
         <Dashboard/>
  )
}

export default MainDashboard