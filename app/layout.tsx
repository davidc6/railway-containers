import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Railway App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <ul className="flex justify-center items-center">
            <li>
              <Link href="/" className="block py-2 px-3 text-white bg-blue-900 rounded hover:text-blue-700 md:bg-transparent">Home</Link>
            </li>
          </ul>
        </nav>
        <main className="flex flex-col justify-between p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
