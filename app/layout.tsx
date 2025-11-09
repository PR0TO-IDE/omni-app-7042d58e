import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "PocketJobs Dark",
  description: "PocketJobs dark mode with purple accents and condensed layout",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground`}
      >
        <div className="min-h-screen bg-gradient-to-b from-[#05030a] via-[#070018] to-[#05030a]">
          <div className="mx-auto flex max-w-md flex-col px-3 pb-3 pt-2">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}