'use client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/actions/client/firebase';

type Input = {
  day: number;
  staff_name: string;
  student_id: string;
  time: string;
  time_done: string;
};

type Output = {
  time: string;
  count: number;
}[];

const toHourlyBucketKey = (time: string) => {
  const [hourPart, period] = time.split(' '); // ['5:32', 'PM']
  const hour = hourPart.split(':')[0]; // '5'
  return `${hour} ${period}`; // '5 PM'
};

export const fitSwipes = async (day: number): Promise<Output> => {
  const swipesRef = collection(db, 'swipes');
  const q = query(swipesRef, where('day', '==', day));

  const querySnapshot = await getDocs(q);
  const swipes: Input[] = querySnapshot.docs.map((doc) => doc.data() as Input);

  const buckets: { [key: string]: number } = {};

  for (const swipe of swipes) {
    const bucketKey = toHourlyBucketKey(swipe.time);
    if (!buckets[bucketKey]) {
      buckets[bucketKey] = 0;
    }
    buckets[bucketKey]++;
  }

  const sortedBuckets: Output = Object.keys(buckets)
    .map((key) => ({
      time: key,
      count: buckets[key],
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return sortedBuckets;
};
