import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, setDoc } from 'firebase/firestore';
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
  projectId: env.VITE_FIREBASE_PROJECT_ID
});
const db = getFirestore(app);

async function testDelete() {
  const dummyId = 'dummy-doc-12345';
  console.log('Creating dummy doc...');
  await setDoc(doc(db, 'testGuides', dummyId), { procedureName: 'Dummy' });
  console.log('Dummy doc created. Now deleting...');
  try {
    await deleteDoc(doc(db, 'testGuides', dummyId));
    console.log('Successfully deleted!');
  } catch (error) {
    console.error('Error deleting:', error);
  }
}
testDelete().catch(console.error);
