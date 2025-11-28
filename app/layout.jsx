import './globals.css';

export const metadata = {
  title: "ArogyaAgent - Find Generic Medicines | Save 85% on Prescriptions",
  description: "Search 10,000+ government-verified generic medicines. Find Jan Aushadhi, IDPL, HAL alternatives. AI-powered prescription scanner & drug safety checker. Save 70-90% on healthcare.",
  keywords: "generic medicines, Jan Aushadhi, medicine finder, prescription scanner, drug interaction checker, affordable healthcare, NPPA prices, government medicines, medicine savings",
  authors: [{ name: "ArogyaAgent" }],
  openGraph: {
    title: "ArogyaAgent - Find Generic Medicines & Save 85%",
    description: "Search 10,000+ government-verified generic medicines. Save 70-90% with Jan Aushadhi alternatives.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArogyaAgent - Find Generic Medicines",
    description: "Save 85% on prescriptions with government-verified generic alternatives",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="canonical" href="https://arogyaagent.vercel.app" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
