import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { AccessibilityProvider } from "@/components/accessibility";
import { CookieConsent } from "@/components/cookie-consent";
import { ReadingGate } from "@/components/reading-gate";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  JsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/json-ld";
import { A11Y_BOOT_SCRIPT } from "@/lib/a11y-boot";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lupa do Brasil · O Brasil de perto",
    template: "%s · Lupa do Brasil",
  },
  description:
    "Comparar planos de governo 2026, fichas dos candidatos à Presidência, casos como Vorcaro/Master e glossário político. Fatos com fonte. Sem partido.",
  applicationName: "Lupa do Brasil",
  keywords: [
    "eleições 2026",
    "planos de governo",
    "comparar candidatos",
    "Presidência",
    "TSE",
    "caso Vorcaro",
    "Banco Master",
    "política Brasil",
  ],
  authors: [{ name: "Lupa do Brasil" }],
  creator: "Lupa do Brasil",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Lupa do Brasil",
    title: "Lupa do Brasil · O Brasil de perto",
    description:
      "Comparar planos de governo 2026, casos e glossário. Fonte na mão. Você decide.",
    images: [
      {
        url: "/brand/og.jpg",
        width: 1200,
        height: 630,
        alt: "Lupa do Brasil · O Brasil de perto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lupa do Brasil · O Brasil de perto",
    description:
      "Comparar planos de governo 2026, casos e glossário. Fonte na mão. Você decide.",
    images: ["/brand/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/brand/apple-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      data-font="md"
      data-contrast="normal"
      data-leitura="simples"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT_SCRIPT }} />
        <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <AccessibilityProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider focus:text-black"
          >
            Ir para o conteúdo
          </a>
          <SiteHeader />
          <main id="conteudo" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <ReadingGate />
          <CookieConsent />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
