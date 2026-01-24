import './globals.css';
import React from 'react';
import Header from './components/Header';
import Link from 'next/link';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'MicroCRM — Freelancer & Invoice Manager',
  description:
    'The all-in-one CRM, Invoice, and Expense manager for modern freelancers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased text-slate-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300 bg-white dark:bg-slate-900">
        <AuthProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <div className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1">
                {children}
              </main>

              <footer className="mt-20 py-12 glass border-t-0">
                <div className="container">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-100 dark:border-gray-800 pb-12">
                    <div className="space-y-4">
                      <div className="font-black text-2xl tracking-tighter text-brand-primary">MicroCRM<span className="text-slate-900 dark:text-white">.</span></div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                        The minimal CRM and invoicing platform for freelancers who value time and simplicity.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Platform</h4>
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                          <Link href="/dashboard" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link href="/pricing" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                            Pricing
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Support</h4>
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                          <Link href="/help" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                            Help Center
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <div className="text-xs text-gray-400">© {new Date().getFullYear()} MicroCRM. All rights reserved.</div>

                    <div className="flex gap-6 text-xs text-gray-400 font-bold uppercase tracking-tighter">
                      <Link href="/privacy" className="hover:text-brand-dark dark:hover:text-white">Privacy</Link>
                      <Link href="/terms" className="hover:text-brand-dark dark:hover:text-white">Terms</Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
