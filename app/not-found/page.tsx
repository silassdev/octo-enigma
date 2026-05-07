'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHome, FiArrowLeft, FiAlertTriangle, FiSearch } from 'react-icons/fi'

export default function NotFound() {
    return (
        <main className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0d1117]">
            {/* Background visual effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full animate-bounce" style={{ animationDuration: '8s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 relative inline-block"
                    >
                        <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none">
                            404
                        </h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                                    <FiAlertTriangle className="text-purple-500 text-5xl md:text-7xl" />
                                </div>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Architectural Gap Detected
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-8"
                    >
                        <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                            The Micro page you are looking for has been moved, archived, or never existed in our structure.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <FiHome size={20} />
                                Back to Homepage
                            </Link>

                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                <FiSearch size={20} />
                                Report Missing Link
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-20 pt-12 border-t border-white/5"
                    >
                        <div className="font-black text-xl tracking-tighter text-white opacity-40">
                            Micro-CRM<span className="text-blue-500">.</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}