import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Link } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevConMU Scheduler",
  description:
    "Save sessions you're interested in attending at the MSCC Developers Conference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex flex-row justify-center p-2">
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/n-d-r-d-g/devcon-scheduler"
            className="text-blue-300 text-center"
          >
            GitHub
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
