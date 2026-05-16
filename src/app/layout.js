import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AudioPlayer from "@/components/AudioPlayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "The Universe I Found In You",
  description: "A deeply emotional interactive web experience",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased bg-black`}
    >
      <body className="min-h-full flex flex-col text-white font-sans">
        <SmoothScroll>
          {children}
          <AudioPlayer />
        </SmoothScroll>
      </body>
    </html>
  );
}
