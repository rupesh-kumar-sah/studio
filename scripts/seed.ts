
import { db } from './firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import productsData from './products.json';

async function seedDatabase() {
  const productsCollection = collection(db, 'products');
  const batch = writeBatch(db);

  productsData.forEach((product) => {
    const docRef = doc(productsCollection, product.id);
    batch.set(docRef, product);
  });

  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
