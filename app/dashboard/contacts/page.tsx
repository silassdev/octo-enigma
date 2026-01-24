export default function ContactsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Contacts</h1>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary text-2xl font-bold">
                    0
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No contacts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Add your clients and leads here to keep track of communication and projects.
                </p>
                <button className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all">
                    Add Contact
                </button>
            </div>
        </div>
    );
}
