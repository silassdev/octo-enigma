"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiUser, FiBriefcase, FiPhone, FiLock, FiSave, FiAlertCircle } from "react-icons/fi";

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        jobTitle: "",
        company: "",
        phoneNumber: "",
        bio: "",
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [saving, setSaving] = useState(false);
    const [savingPass, setSavingPass] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(prev => ({ ...prev, ...docSnap.data() }));
                } else {
                    setFormData(prev => ({ ...prev, name: user.displayName || "" }));
                }
            }
        };
        if (!loading) fetchUserData();
    }, [user, loading]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            await updateProfile(user, { displayName: formData.name });
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.email) return;
        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setSavingPass(true);
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, passwords.new);
            toast.success("Password updated!");
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/wrong-password') {
                toast.error("Current password is incorrect.");
            } else {
                toast.error("Failed to update password. Please re-login and try again.");
            }
        } finally {
            setSavingPass(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FiUser /> Public Profile
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Job Title</label>
                            <input
                                type="text"
                                value={formData.jobTitle}
                                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors min-h-[100px]"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all flex items-center gap-2"
                        >
                            {saving ? "Saving..." : <><FiSave /> Save Profile</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Email & Security Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Account Info */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FiLock /> Account Security
                    </h2>

                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 text-gray-500 cursor-not-allowed border border-gray-200 dark:border-slate-800"
                            />
                            <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <p className="flex items-start gap-2 mt-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
                            <FiAlertCircle className="shrink-0 mt-0.5" />
                            To change your email address, please contact your workspace administrator for security verification.
                        </p>
                    </div>
                </div>

                {/* Password Change */}
                {isGoogleUser ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Managed by Google</h3>
                        <p className="text-sm text-gray-500">
                            Your account is authenticated via Google. You cannot change your password here. Please manage your security settings through your Google Account.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="New Password (min 6 chars)"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-brand-primary outline-none transition-colors text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={savingPass}
                                className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                            >
                                {savingPass ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
