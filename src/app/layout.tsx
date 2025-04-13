import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifexAI - Your AI Detective",
  description: "AI detective for your health, finance, and digital safety",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <header className="bg-blue-700 text-white">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <Link href="/" className="text-2xl font-bold">
                    LifexAI
                  </Link>
                  <nav>
                    <ul className="flex space-x-6">
                      <li>
                        <Link href="/" className="hover:text-blue-200">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/finance" className="hover:text-blue-200">
                          Finance
                        </Link>
                      </li>
                      <li>
                        <Link href="/login" className="hover:text-blue-200">
                          Login
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </header>
              <main className="flex-grow">
                {children}
              </main>
              <footer className="bg-gray-100 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600">
                  <p>© 2025 LifexAI - Bitcamp 2025 Hackathon Project</p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
