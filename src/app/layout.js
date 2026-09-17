import { Manrope, Inter } from 'next/font/google';
import './globals.css';

const display = Manrope({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700', '800'] });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: "Sigi",
  description: "L'agent IA qui transforme vos contacts en clients présents, réservations et ventes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-app font-sans text-ink2 antialiased">{children}</body>
    </html>
  );
}
