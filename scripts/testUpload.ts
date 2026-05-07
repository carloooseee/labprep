import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET
});

const storage = getStorage(app);

async function testUpload() {
  console.log('Starting upload test...');
  console.log('Bucket:', env.VITE_FIREBASE_STORAGE_BUCKET);
  const storageRef = ref(storage, `procedures/test_${Date.now()}.txt`);
  
  try {
    const snapshot = await uploadString(storageRef, 'This is a test file.');
    console.log('Upload successful!');
    const url = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

testUpload().catch(console.error);
