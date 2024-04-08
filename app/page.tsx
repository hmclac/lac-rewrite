'use client';
import { useEffect } from 'react';

import { useSignals } from '@preact/signals-react/runtime';

import { HomePageGraph } from '@/components/Home/Graph';
import { DataType, data } from '@/signals/Home';

import { time } from '@/actions/utils';
import { fitSwipes } from '@/actions/client/data';

const Home = () => {
  useSignals();

  const fetchData = async () => {
    const res = await fitSwipes(time.getDay(Date.now()));
    data.value = res;
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main className='flex flex-col items-center justify-between py-6'>
      <section className='flex flex-col items-center w-11/12'>
        <h1 className='pb-10'>Swipe Graph</h1>

        <HomePageGraph data={data.value}></HomePageGraph>
      </section>
    </main>
  );
};

export default Home;
