import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideBar from "@/components/sideBar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import { MovieCacheProvider } from "@/contexts/MovieCacheContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ChatBubble } from "@/components/chat-bubble";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CineSafe — Discover Family-Safe Movies",
  description:
    "CineSafe helps you discover and explore family-friendly movies rated G, PG, and PG-13. Curated content your whole family can enjoy.",
  keywords: ["family movies", "safe movies for kids", "G rated", "PG rated", "family friendly"],
  openGraph: {
    title: "CineSafe — Discover Family-Safe Movies",
    description: "Curated family-friendly movies for everyone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${geistSans.variable} font-[var(--font-poppins)] antialiased bg-[hsl(220,20%,8%)]`}>
        <MovieCacheProvider>
          <FavoritesProvider>
            <ChatProvider>
              <SideBar />
              {children}
              <Footer />
              <ChatBubble />
            </ChatProvider>
          </FavoritesProvider>
        </MovieCacheProvider>
      </body>
    </html>
  );
}
