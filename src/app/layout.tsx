import { Button, Link, Tooltip } from "@nextui-org/react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Image from "next/image";
import { FaGithub, FaHeart } from "react-icons/fa6";
import { ThemeSwitch } from "./components/ThemeSwitch";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <div className="flex min-h-[100svh] flex-col">
            <nav className="print:hidden sticky top-0 z-10 mx-auto flex w-[120rem] max-w-full flex-row items-center justify-between border-b border-slate-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-950">
              <Link
                href={"/"}
                className="flex flex-row items-center gap-2 rounded text-sm font-bold text-slate-700 grayscale hover:text-black hover:no-underline hover:grayscale-0 focus:ring-0 focus:ring-offset-0 focus-visible:text-black focus-visible:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white focus-visible:grayscale-0 motion-safe:transition motion-safe:duration-300 dark:text-slate-300 dark:hover:text-white dark:focus-visible:text-white dark:focus-visible:ring-blue-500 focus-visible:dark:ring-offset-slate-900"
              >
                <span aria-hidden>
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
                <Tooltip content="GitHub link">
                  <Button
                    size="md"
                    radius="full"
                    variant="light"
                    as={Link}
                    href="https://github.com/n-d-r-d-g/devcon-scheduler"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    aria-label="GitHub link"
                    className="!text-default-foreground"
                    isIconOnly
                  >
                    <FaGithub size={16} />
                  </Button>
                </Tooltip>
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
