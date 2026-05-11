"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    loading: boolean;
    emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    emailVerified: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            if (!authUser) {
                setProfile(null);
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (user) {
            const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
                if (snapshot.exists()) {
                    setProfile({ ...snapshot.data(), id: snapshot.id });
                }
                setLoading(false);
            }, (error) => {
                console.error("Profile Snapshot Error:", error.message, error.code);
                setLoading(false);
            });
            return () => unsubscribeProfile();
        } else {
            // If user is null, make sure loading is false
            if (!loading) {
                 setLoading(false);
            }
        }
    }, [user]);

    const emailVerified = user?.emailVerified ?? false;

    return (
        <AuthContext.Provider value={{ user, profile, loading, emailVerified }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
