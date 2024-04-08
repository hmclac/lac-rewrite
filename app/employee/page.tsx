'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Equipment } from '@/components/Employee/Equipment';
import { Bikes } from '@/components/Employee/Bikes';
import { Headcount } from '@/components/Employee/Headcount';

import { handleSwipe } from '@/actions/client/firestore';

const Employee = () => {
  const session = useSession();
  const [swipe, setSwipe] = useState('');

  if (!session || !session.data) {
    return <>Error</>;
  }
  const { user } = session.data;

  const submitSwipe = async () => {
    try {
      const res = await handleSwipe(user?.email!, swipe);
      if (!res) return;
      toast.success(`Swipe submitted: ${swipe}`, {
        duration: 10000,
      });
      setSwipe('');
    } catch (e) {
      console.error(e);
      toast.error('Error submitting swipe');
    }
  };

  return (
    <section className='flex flex-col items-center p-4 mx-1 rounded-2xl border-stone-700'>
      <div className='flex-col p-1'>Employee</div>
      <div className='m-10 w-9/12'>
        <Card>
          <CardHeader>
            <CardTitle>Swipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2'>
              <Input
                type='email'
                placeholder='Enter ID'
                value={swipe}
                onChange={(e) => setSwipe(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    submitSwipe();
                  }
                }}
              />
              <Button type='submit' onClick={(e) => submitSwipe()}>
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='equipment' className='w-11/12'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='equipment'>Equipment</TabsTrigger>
          <TabsTrigger value='bikes'>Bikes</TabsTrigger>
          <TabsTrigger value='headcount'>Headcount</TabsTrigger>
        </TabsList>
        <TabsContent value='equipment'>
          <Card>
            <CardContent className='space-y-2'>
              <Equipment user={user!} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='bikes'>
          <Card>
            <CardContent className='space-y-2'>
              <Bikes user={user!} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='headcount'>
          <Card>
            <CardContent className='space-y-2'>
              <Headcount />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Employee;
