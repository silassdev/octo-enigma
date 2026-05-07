export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Reports</h1>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 text-2xl font-bold">
                    %
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No data to report</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Financial insights will appear here once you start generating activity.
                </p>
                <button className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all">
                    View Sample Data
                </button>
            </div>
        </div>
    );
}
