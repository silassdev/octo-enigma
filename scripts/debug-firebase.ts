import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

console.log('--- DEBUG START ---');
console.log('Key exists:', !!serviceAccountKey);
if (serviceAccountKey) {
    console.log('Key length:', serviceAccountKey.length);
    console.log('Key starts with:', serviceAccountKey.substring(0, 20));
    try {
        const parsed = JSON.parse(serviceAccountKey);
        console.log('Parsed successfully!');
        console.log('Keys:', Object.keys(parsed));
        console.log('Has private_key:', !!parsed.private_key);
        if (parsed.private_key) {
            console.log('Private key length:', parsed.private_key.length);
            console.log('Private key snippet:', parsed.private_key.substring(0, 30));
        }
    } catch (e: any) {
        console.log('Parse failed:', e.message);
        // Try to identify where it failed
        for (let i = 0; i < serviceAccountKey.length; i += 50) {
            console.log(`Snippet at ${i}:`, serviceAccountKey.substring(i, i + 50));
        }
    }
}
console.log('--- DEBUG END ---');
