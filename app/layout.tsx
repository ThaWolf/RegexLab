import './globals.css';
import Providers from './providers';
import Navbar from './components/Navbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'RegexLab',
  description: 'RegexLab with authentication',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
