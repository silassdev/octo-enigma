"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle, FiInbox, FiTrendingUp, FiCreditCard, FiArrowRight } from "react-icons/fi";

export default function Home() {
  const features = [
    {
      icon: FiInbox,
      label: "Smart CRM",
      description: "Manage leads and clients with tags and status tracking.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiCreditCard,
      label: "Fast Invoicing",
      description: "Create professional PDFs and send email links in seconds.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FiTrendingUp,
      label: "Expense Tracking",
      description: "Snapshot receipts and let OCR handle the data entry.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: FiCheckCircle,
      label: "Project Canvas",
      description: "Keep tasks organized with due dates and priorities.",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <main className="relative overflow-hidden bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="container pt-24 pb-20 md:pt-32 md:pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
              Built for Freelancers
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none">
              Manage your focus, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-600">
                not just your files.
              </span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              MicroCRM combines contacts, projects, invoicing, and expense tracking into one
              beautifully simple dashboard. Spend less time on admin and more on what you love.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary text-white font-bold text-lg shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
              >
                Get Started Free <FiArrowRight />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl glass border border-gray-100 dark:border-gray-800 hover:border-brand-primary/30 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{feature.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="container py-20 overflow-hidden">
        <div className="relative rounded-3xl bg-slate-900 overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500" />
          <div className="p-4 md:p-8 flex items-center gap-2 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">MicroCRM — Dashboard Preview</span>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4 space-y-4">
                <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
              </div>
              <div className="col-span-12 md:col-span-8 space-y-4">
                <div className="h-20 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center px-8">
                  <div className="w-3/4 h-3 rounded-full bg-brand-primary/30" />
                </div>
                <div className="h-80 rounded-2xl bg-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="container py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to simplify your business?</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
            Join the community of freelancers who chose efficiency over complexity.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex px-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl hover:scale-105 transition-all shadow-xl"
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </section>
    </main>
  );
}