import { getFirestore } from 'firebase/firestore';
import app from './firebase';

const database = getFirestore(app);

export default database;
