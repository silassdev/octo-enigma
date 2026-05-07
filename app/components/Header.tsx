'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBox, FiUser, FiLogOut, FiLayout, FiChevronRight } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigation Items Logic
  const publicNav = [
    { label: 'Product', href: '/#features' }, // Linking to features section
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const loggedInNav = [
    // Intentionally minimal for logged in users as requested
    // "Leaving the site name and logo at left as constant"
  ];

  if (loading) return null; // Or a skeleton

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${isScrolled ? 'bg-white/70 dark:bg-slate-900/70 shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                <FiBox className="w-7 h-7" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
                  MicroCRM<span className="text-brand-primary">.</span>
                </span>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 -mt-0.5">
                  Freelance Suite
                </div>
              </div>
            </Link>
          </div>

          {/* Middle: nav (desktop) */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-brand-primary"
                    />
                  )}
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Free Plan</span>
                </div>

                <button
                  onClick={async () => {
                    await signOut(auth);
                    toast.success("See you later!");
                    window.location.href = "/";
                  }}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all"
                  title="Sign Out"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>

                <Link href="/dashboard">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full ring-2 ring-brand-primary/20" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-brand-primary/20">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-3 pb-4 space-y-3">
                <div className="px-4">
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        {item.label}
                      </Link>
                    ))}

                    {user ? (
                      <>
                        <div className="px-3 py-2 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 mt-2">
                          {user.photoURL && (
                            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                          )}
                          <span className="text-sm font-bold text-slate-700 dark:text-gray-200">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            signOut(auth);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileOpen(false)}
                        className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <FiUser className="w-4 h-4" />
                        Sign in
                      </Link>
                    )}

                    <div className="mt-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                      <ThemeToggle />
                    </div>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
