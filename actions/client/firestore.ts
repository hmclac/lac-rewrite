import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from '@firebase/firestore';

import { db } from '@/actions/client/firebase';
import { time } from '@/actions/utils';

export const fetchEquipment = async () => {
  const q = query(
    collection(db, 'equipment'),
    where('time_checked_in', '==', null),
    orderBy('time_checked_out', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const equipment = querySnapshot.docs.map((doc) => doc.data());
  return equipment;
};

// checkout equipment
type EquipmentCheckOut = {
  equipmentType: string;
  studentName: string;
  studentID: string;
  studentEmail: string;
  staffName: string;
};
// now we can use this type to check out the given equipment to firestore
export const handleEquipmentCheckOut = async ({
  equipmentType,
  studentName,
  studentID,
  studentEmail,
  staffName,
}: EquipmentCheckOut) => {
  try {
    const q = query(
      collection(db, 'equipment'),
      where('student_id', '==', studentID),
      where('time_checked_in', '==', null)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size) {
      throw new Error('Student already renting equipment');
    }
    const now = Date.now();
    const docData = {
      equipment_type: equipmentType,
      student_name: studentName,
      student_id: studentID,
      student_email: studentEmail,
      rented_staff: staffName,
      returned_staff: null,
      time_checked_out: String(now),
      time_checked_in: null,
    };

    const docRef = await addDoc(collection(db, 'equipment'), docData);

    return docRef.path;
  } catch (error) {
    throw new Error(error as string);
  }
};

// return equipment
type EquipmentReturn = {
  equipmentType: string;
  student_id: string;
  staffName: string;
};

export const returnEquipment = async ({
  equipmentType,
  student_id,
  staffName,
}: EquipmentReturn) => {
  const q = query(
    collection(db, 'equipment'),
    where('equipment_type', '==', equipmentType),
    where('student_id', '==', student_id),
    where('time_checked_in', '==', null)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.size || querySnapshot.size > 1) {
    throw new Error(
      'Equipment already checked in, multiple equipment being rented'
    );
  }
  const docRef = querySnapshot.docs[0].ref;

  const now = Date.now();
  try {
    await updateDoc(docRef, {
      time_checked_in: String(now),
      returned_staff: staffName,
    });
    return docRef.path;
  } catch (e) {
    throw new Error('Error updating document: ' + e);
  }
};

export const handleSwipe = async (email: string, swipe: string) => {
  try {
    const now = Date.now();
    const docData = {
      staff_name: email,
      student_id: swipe,
      time_done: String(now),
      time: time.currentShort(),
      day: time.getDay(now),
    };

    const docRef = await addDoc(collection(db, 'swipes'), docData);

    return docRef.path;
  } catch (error) {
    throw new Error('Error adding document: ' + error);
  }
};

export const fetchBikes = async () => {
  const q = query(
    collection(db, 'bikes'),
    where('time_checked_in', '==', null),
    orderBy('time_checked_out', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const bikes = querySnapshot.docs.map((doc) => doc.data());
  return bikes;
};
type BikeReturn = {
  bikeNumber: string;
  staffName: string;
};

export const returnBike = async ({ bikeNumber, staffName }: BikeReturn) => {
  const q = query(
    collection(db, 'bikes'),
    where('bike_number', '==', bikeNumber),
    where('time_checked_in', '==', null)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.size || querySnapshot.size > 1) {
    throw new Error('Bike already checked in, multiple bikes being rented');
  }
  const docRef = querySnapshot.docs[0].ref;

  const now = Date.now();
  try {
    await updateDoc(docRef, {
      time_checked_in: String(now),
      returned_staff: staffName,
    });
    return docRef.path;
  } catch (e) {
    throw new Error('Error updating document: ' + e);
  }
};

type BikeCheckOut = {
  bikeNumber: string;
  studentName: string;
  studentID: string;
  studentEmail: string;
  staffName: string;
  lock: string;
};

export const handleBikeCheckOut = async ({
  bikeNumber,
  studentName,
  studentID,
  studentEmail,
  staffName,
  lock,
}: BikeCheckOut) => {
  const q = query(
    collection(db, 'bikes'),
    where('bike_number', '==', bikeNumber),
    where('time_checked_in', '==', null)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size) {
    throw new Error('Bike already checked out');
  }
  const q2 = query(
    collection(db, 'bikes'),
    where('student_id', '==', studentID),
    where('time_checked_in', '==', null)
  );
  const querySnapshot2 = await getDocs(q2);
  if (querySnapshot2.size) {
    throw new Error('Student already renting a bike');
  }

  try {
    const now = Date.now();
    const docData = {
      bike_number: bikeNumber,
      student_name: studentName,
      student_id: studentID,
      student_email: studentEmail,
      rented_staff: staffName,
      returned_staff: null,
      time_checked_out: String(now),
      time_checked_in: null,
      lock,
      renews: 0,
      time_due: String(now + 1000 * 60 * 60 * 24),
    };

    const docRef = await addDoc(collection(db, 'bikes'), docData);

    return docRef.path;
  } catch (error) {
    throw new Error(error as string);
  }
};
