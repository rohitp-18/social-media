import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import Middleware from "./middler";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "TS - Social network site",
  description:
    "Social network site use to share profile and show your projects and experience, post your recent activities to your network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        // className={`
        //   ${geistSans.variable} ${geistMono.variable}
        // bg-background text-foreground antialiased`}
        className="  bg-background text-foreground antialiased"
      >
        <ThemeProvider
          enableSystem
          defaultTheme="default"
          attribute="class"
          disableTransitionOnChange
        >
          <Middleware>{children}</Middleware>
        </ThemeProvider>
      </body>
    </html>
  );
}
