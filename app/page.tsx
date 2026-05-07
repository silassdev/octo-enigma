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
    <main className="relative overflow-hidden bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="container pt-32 pb-24 md:pt-40 md:pb-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
                Built for Freelancers
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] md:leading-[1.1]">
              Manage your focus, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-500 to-blue-600 animate-gradient-x">
                not just your files.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              MicroCRM combines contacts, projects, invoicing, and expense tracking into one
              beautifully simple dashboard. Spend less time on admin and more on what you love.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/auth/register"
                className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold text-lg shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-center gap-2">
                  Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-1 transition-all backdrop-blur-sm"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="container pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-purple-500 to-blue-500 rounded-[2.5rem] opacity-30 blur-2xl" />
          <div className="relative rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Fake Browser Bar */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 text-[10px] text-gray-400 font-mono border border-white/5">
                  <span className="text-brand-primary">🔒</span> microcrm.io/dashboard
                </div>
              </div>
            </div>

            {/* UI Content Preview */}
            <div className="p-8 md:p-12 bg-[#0B0F19]">
              <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Placeholder */}
                <div className="hidden md:block col-span-3 space-y-6">
                  <div className="h-10 w-32 rounded-lg bg-white/10 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-8 rounded-lg bg-white/5 border border-white/5" />
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-9 space-y-8">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-48 rounded-lg bg-white/10" />
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 rounded-2xl bg-white/5 border border-white/5 p-6 space-y-4">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/20" />
                        <div className="w-24 h-4 rounded bg-white/10" />
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-primary/10 to-transparent" />
                    <div className="absolute bottom-0 left-6 right-6 h-px bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="container py-24 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Everything you need. <br /><span className="text-gray-400">Nothing you don't.</span></h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">Streamlined tools designed specifically for the modern independent worker.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-primary/30 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{feature.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="container py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary/5 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to take control?</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of freelancers who have already simplified their business with MicroCRM.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 px-12 py-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all"
          >
            Start Your Free Trial <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}