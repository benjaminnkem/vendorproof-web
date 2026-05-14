import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/components/common/providers/query-provider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "VendorProof",
  description: "Public trust and payment initiation for verified vendors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = "vp-theme";
                  var stored = window.localStorage.getItem(key);
                  var theme = (stored === "light" || stored === "dark")
                    ? stored
                    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  var root = document.documentElement;
                  root.classList.toggle("dark", theme === "dark");
                  root.dataset.theme = theme;
                } catch (err) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} min-h-full flex flex-col`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
