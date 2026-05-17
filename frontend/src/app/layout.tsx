import type { Metadata } from 'next';
import { ApolloClientProvider } from '@/components/providers/ApolloProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Traffic Urbain',
  description: 'Plateforme de gestion du trafic urbain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ApolloClientProvider>
          {children}
        </ApolloClientProvider>
      </body>
    </html>
  );
}