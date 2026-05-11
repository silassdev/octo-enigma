"use client";

import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

export async function runFirestoreDiagnostic() {
    console.log("--- STARTING FIRESTORE DIAGNOSTIC ---");
    console.log("User UID:", auth.currentUser?.uid || "NOT LOGGED IN");
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        console.log("Auth Token (First 20 chars):", token.substring(0, 20) + "...");
    }
    console.log("Firestore Project ID:", db.app.options.projectId);

    try {
        // 1. Simple Write Test
        console.log("1. Testing Write to 'diagnostic_pings'...");
        const writeRef = await addDoc(collection(db, "diagnostic_pings"), {
            timestamp: new Date().toISOString(),
            uid: auth.currentUser?.uid,
            test: true
        });
        console.log("   ✅ Write Success! ID:", writeRef.id);

        // 2. Simple Read Test
        console.log("2. Testing Read from 'diagnostic_pings'...");
        const readSnap = await getDocs(query(collection(db, "diagnostic_pings"), limit(1)));
        console.log("   ✅ Read Success! Items found:", readSnap.size);

        // 3. Contacts Read Test (No Filters)
        console.log("3. Testing Raw Read from 'contacts'...");
        const contactsSnap = await getDocs(query(collection(db, "contacts"), limit(1)));
        console.log("   ✅ Raw Contacts Read Success! Items found:", contactsSnap.size);

        return "DIAGNOSTIC PASSED";
    } catch (error: any) {
        console.error("   ❌ DIAGNOSTIC FAILED!");
        console.error("   Error Name:", error.name);
        console.error("   Error Message:", error.message);
        console.error("   Error Code:", error.code);
        return `DIAGNOSTIC FAILED: ${error.message}`;
    }
}
