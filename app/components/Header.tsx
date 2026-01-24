'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBox, FiUser, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${isScrolled ? 'bg-white/70 dark:bg-slate-900/70 shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                <FiBox className="w-7 h-7" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white leading-none block">
                  MicroCRM<span className="text-brand-primary">.</span>
                </span>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 -mt-0.5">
                  Freelance Suite
                </div>
              </div>
            </Link>
          </div>

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-brand-primary" />
                  )}
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <button
                    onClick={() => signOut(auth)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-dark transition-all text-sm font-bold shadow-lg shadow-brand-primary/20"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>

            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
