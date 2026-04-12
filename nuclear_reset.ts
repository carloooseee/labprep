import { db } from './src/firebase';
import { collection, getDocs, deleteDoc, doc, writeBatch, GeoPoint, Timestamp } from 'firebase/firestore';
import { testGuides, hospitals, initialUsers, hospitalOverrides, stats, broadcasts, activity } from './src/data/seedData';

async function performNuclearReset() {
  console.log('--- STARTING TOTAL SYSTEM RESET (DIRECT SCRIPT) ---');

  const collections = ['testGuides', 'hospitals', 'users', 'hospitalOverrides', 'stats', 'broadcasts', 'activity'];
  
  for (const colName of collections) {
    console.log(`Wiping collection: ${colName}...`);
    const snapshot = await getDocs(collection(db, colName));
    const deleteBatch = writeBatch(db);
    snapshot.docs.forEach(snap => deleteBatch.delete(snap.ref));
    await deleteBatch.commit();
    console.log(`Cleared ${snapshot.size} documents from ${colName}.`);
  }

  console.log('--- RE-SEEDING CLEAN DATA ---');
  const seedBatch = writeBatch(db);
  
  testGuides.forEach(guide => {
    seedBatch.set(doc(db, 'testGuides', guide.id), guide);
  });

  hospitals.forEach(h => {
    seedBatch.set(doc(db, 'hospitals', h.id), {
      ...h,
      location: new GeoPoint(h.location._lat, h.location._long)
    });
  });

  initialUsers.forEach(u => {
    seedBatch.set(doc(db, 'users', u.uid), u);
  });

  hospitalOverrides.forEach(o => {
    seedBatch.set(doc(db, 'hospitalOverrides', o.id), o);
  });

  broadcasts.forEach(b => {
    seedBatch.set(doc(db, 'broadcasts', b.id), b);
  });

  stats.forEach(s => {
    seedBatch.set(doc(db, 'stats', s.hospitalId), s);
  });

  activity.forEach(a => {
    const ref = doc(collection(db, 'activity'));
    seedBatch.set(ref, {
      ...a,
      timestamp: Timestamp.fromDate(new Date())
    });
  });

  await seedBatch.commit();
  console.log('--- NUCLEAR RESET AND SEED COMPLETE ---');
  process.exit(0);
}

performNuclearReset().catch(err => {
  console.error(err);
  process.exit(1);
});
