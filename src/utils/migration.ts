import { db } from '../firebase';
import { collection, doc, writeBatch, GeoPoint, Timestamp } from 'firebase/firestore';
import { hospitals, testGuides, initialUsers, hospitalOverrides, stats, activity, broadcasts } from '../data/seedData';

/**
 * Seeds the initial data to Firestore.
 * This includes hospitals, global test guides, and initial user profiles.
 */
export const seedFirestore = async () => {
  const batch = writeBatch(db);

  try {
    // 1. Seed Hospitals
    console.log('Seeding Hospitals...');
    for (const hospital of hospitals) {
      const hospitalRef = doc(db, 'hospitals', hospital.id);
      batch.set(hospitalRef, {
        ...hospital,
        location: new GeoPoint(hospital.location._lat, hospital.location._long)
      });
    }

    // 2. Seed Test Guides
    console.log('Seeding Test Guides...');
    for (const guide of testGuides) {
      const guideRef = doc(db, 'testGuides', guide.id);
      batch.set(guideRef, guide);
    }

    // 2.5 Seed Hospital Overrides
    console.log('Seeding Overrides...');
    for (const override of hospitalOverrides) {
      const overrideRef = doc(db, 'hospitalOverrides', override.id);
      batch.set(overrideRef, override);
    }

    // 3. Seed Initial Users
    console.log('Seeding Users...');
    for (const user of initialUsers) {
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, user);
    }

    for (const item of broadcasts) {
      const broadcastRef = doc(db, 'broadcasts', item.id);
      batch.set(broadcastRef, item);
    }

    // 3.5 Seed Stats and Activity
    console.log('Seeding Stats...');
    for (const stat of stats) {
      const statRef = doc(db, 'stats', stat.hospitalId);
      batch.set(statRef, stat);
    }

    console.log('Seeding Activity...');
    for (const item of activity) {
      const activityRef = doc(collection(db, 'activity'));
      batch.set(activityRef, {
        ...item,
        timestamp: Timestamp.fromDate(new Date())
      });
    }

    // 4. Commit Batch
    await batch.commit();
    console.log('Seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    return { success: false, error };
  }
};
