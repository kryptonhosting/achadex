/* app/layout.tsx */
import type { Metadata } from 'node_modules/next' with { 'resolution-mode': 'import' };
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Achadex - Ache antes, pague menos',
  description: 'Encontre os melhores preços perto de você em tempo real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0A0A0A] text-white antialiased min-h-screen selection:bg-[#D4FF32] selection:text-black">
        {children}
      </body>
    </html>
  );
}
