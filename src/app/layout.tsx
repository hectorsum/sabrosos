import type { Metadata, Viewport } from 'next';
import { Anton, Archivo } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const archivo = Archivo({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-archivo' });

export const metadata: Metadata = {
  title: 'Sabrosos · Barra criolla',
  description: 'Crea tu plato a tu manera, ¡nosotros lo hacemos sabroso! Carta digital y pedidos por WhatsApp en San Isidro, Lima.',
};

export const viewport: Viewport = { themeColor: '#e41e13' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${anton.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
