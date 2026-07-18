import { Link, Tooltip } from "@heroui/react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import { GitHubButton } from "./components/GitHubButton";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { retrieveConfYear } from "@/functions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const shortYear = retrieveConfYear("YY");
const yearLabel = shortYear ? `${shortYear}'` : "";

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <div className="flex min-h-[100svh] flex-col">
            <nav className="print:hidden sticky top-0 z-10 mx-auto flex w-[120rem] max-w-full flex-row items-center justify-between border-b border-slate-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-950">
              <Link
                href={"/"}
                style={{ "--year": `"${yearLabel}"` } as React.CSSProperties}
                className="group flex flex-row items-center gap-2 relative rounded text-sm font-bold text-slate-700 hover:text-black hover:no-underline focus-visible:text-black focus-visible:no-underline focus-visible:!outline-offset-8 motion-safe:transition motion-safe:duration-300 dark:text-slate-300 dark:hover:text-white dark:focus-visible:text-white dark:focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900 after:content-[var(--year)] after:absolute after:bottom-[0.75lh] after:right-[-1ch] after:text-[0.9em] after:font-mono after:text-green-700 dark:after:text-green-500"
              >
                <span
                  aria-hidden
                  className="grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-safe:transition motion-safe:duration-300"
                >
                  <Image
                    src="/logo.svg"
                    alt="MUDOCS"
                    width={16}
                    height={20}
                    className="min-w-[16px] min-h-[20px]"
                    priority
                  />
                </span>{" "}
                DevConMU Scheduler
              </Link>
              <aside className="flex flex-row items-center gap-1">
                <GitHubButton />
                <ThemeSwitch />
              </aside>
            </nav>
            <main className="root-container min-h-0 h-[calc(100svh-var(--header-height)-var(--footer-height))] flex grow flex-col relative">
              {children}
            </main>
            <footer className="print:hidden grid place-content-center py-2 isolate">
              <span className="inline-flex items-center gap-[0.5ch] text-center text-xs text-gray-700 dark:text-gray-400">
                Made with{" "}
                <Tooltip content="love, sweat & tears">
                  <FaHeart
                    className="inline-block text-red-800 cursor-help dark:text-red-400"
                    aria-label="love, sweat & tears"
                  />
                </Tooltip>
                <span>by</span>
                <Link
                  href="https://github.com/n-d-r-d-g"
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className="rounded font-size-inherit !text-inherit font-extrabold focus:ring-0 focus:ring-offset-0 focus-visible:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-500 focus-visible:dark:ring-offset-slate-900"
                >
                  n-d-r-d-g
                </Link>
              </span>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
