export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Invoices</h1>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-2xl font-bold">
                    $0
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No invoices issued</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Create professional invoices and get paid faster.
                </p>
                <button className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold shadow-lg shadow-green-500/20 hover:opacity-90 transition-all">
                    Create Invoice
                </button>
            </div>
        </div>
    );
}
