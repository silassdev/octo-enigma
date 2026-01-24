"use client";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
        ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-gray-200/50 dark:border-white/5 py-3'
        : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                <FiBox className="w-7 h-7" />
              </div>
              <div>
                <span className="font-black text-1xl tracking-tighter text-slate-900 dark:text-white leading-none block">
                  MicroCRM<span className="text-brand-primary">.</span>
                </span>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 -mt-0.5">
                  Freelance Suite
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!user ? (
              // Public Nav
              <div className="flex items-center p-1 rounded-full bg-gray-100/50 dark:bg-white/5 border border-transparent dark:border-white/5 backdrop-blur-sm">
                {publicNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-5 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              // Logged In Nav (Minimal - maybe just a quick link to dashboard if not already there)
              pathname !== '/dashboard' && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors mr-4"
                >
                  <FiLayout /> Dashboard
                </Link>
              )
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!user ? (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/10"
              >
                <FiUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
                {/* User Profile Dropdown or just Info */}
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {user.displayName || "User"}
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-slate-900 dark:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5"
          >
            <div className="p-4 space-y-2">
              {!user ? (
                <>
                  {publicNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-gray-600 dark:text-gray-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary font-bold mt-4"
                  >
                    Sign In <FiChevronRight />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-gray-600 dark:text-gray-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut(auth);
                      setMobileOpen(false);
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
