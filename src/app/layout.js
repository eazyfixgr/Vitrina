import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vitrina.gr'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vitrina - Το κατάστημά σας",
    template: "%s | Vitrina",
  },
  description: "Βιτρίνα προϊόντων για το κατάστημά σας. Ανακαλύψτε τη συλλογή μας και παραγγείλτε με ένα τηλεφώνημα.",
  keywords: ["vitrina", "κατάστημα", "προϊόντα", "βιτρίνα", "eshop", "παραγγελία"],
  authors: [{ name: "Vitrina" }],
  creator: "Vitrina",
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "Vitrina",
    title: "Vitrina - Το κατάστημά σας",
    description: "Βιτρίνα προϊόντων για το κατάστημά σας. Ανακαλύψτε τη συλλογή μας.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitrina - Το κατάστημά σας",
    description: "Βιτρίνα προϊόντων για το κατάστημά σας.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="el" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
