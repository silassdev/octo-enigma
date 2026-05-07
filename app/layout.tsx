import './globals.css';
import React from 'react';
import Header from './components/Header';
import Link from 'next/link';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthProvider';
import Footer from './components/Footer';

export const metadata = {
  title: 'MicroCRM — Freelancer & Invoice Manager',
  description:
    'The all-in-one CRM, Invoice, and Expense manager for modern freelancers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased text-slate-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-500 bg-background">
        <AuthProvider>
          <ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '600',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--brand-primary)',
                    secondary: 'white',
                  },
                  style: {
                    border: '1px solid var(--brand-primary)',
                    background: 'rgba(59, 130, 246, 0.1)',
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                  style: {
                    border: '1px solid #ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                  }
                }
              }}
            />
            <div className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
