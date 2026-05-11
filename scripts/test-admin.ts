import * as dotenv from 'dotenv';
import path from 'path';
import * as admin from 'firebase-admin';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

console.log('--- TEST START ---');
console.log('Project ID:', projectId);
console.log('Client Email:', clientEmail);
console.log('Private Key found:', !!privateKey);

if (clientEmail && privateKey && projectId) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log('App initialized!');
        
        async function test() {
            try {
                const users = await admin.auth().listUsers(1);
                console.log('Successfully listed users! Count:', users.users.length);
            } catch (e: any) {
                console.log('Auth test failed:', e.message);
                if (e.code === 'auth/invalid-credential') {
                    console.log('CREDENTIAL ERROR: Check your private key and client email.');
                }
            }
        }
        test();
    } catch (e: any) {
        console.log('Init failed:', e.message);
    }
} else {
    console.log('Missing env vars!');
}
