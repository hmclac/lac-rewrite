'use client';
'use strict';
import * as React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { UserType } from '@/components/SessionProvider';
import { ComboSelector } from '@/components/ComboSelector';
import { Table } from '@/components/Employee/Table';

import { selected } from '@/signals/Employee';
import { getUsername, date } from '@/actions/utils';
import {
  fetchBikes,
  handleBikeCheckOut,
  returnBike,
} from '@/actions/client/firestore';
import { toast } from 'sonner';

const bikes = ['1', '2', '3', '69'];

const bikeLocks = ['A', 'B', 'C', 'D'];

const names = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'];

const columns = [
  'Bike #',
  'Lock',
  'Student Name',
  'Student ID',
  'Email',
  'Rented By',
  'Date Checked Out',
  'Date Due',
  'Renews',
  'Actions',
];

type Props = {
  user: UserType;
};

type Bike = {
  bike_number: string;
  lock: string;
  renews: number;
  rented_staff: string;
  returned_staff?: string;
  student_email: string;
  student_id: string;
  student_name: string;
  time_checked_in?: string;
  time_checked_out: string;
  time_due: string;
};

export const Bikes = (props: Props) => {
  const { user } = props;
  useSignals();

  const queryClient = useQueryClient();
  const refreshCache = () =>
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['bikes'],
    queryFn: fetchBikes,
  });

  if (isPending || isError) return <p>{error?.message}</p>;

  const checkout = async () => {
    try {
      const res = await handleBikeCheckOut({
        bikeNumber: selected.bike.value,
        studentName: selected.bikeName.value,
        studentID: selected.bikeStudentID.value,
        studentEmail: selected.bikeStudentEmail.value,
        staffName: user.email!,
        lock: selected.bikeLock.value,
      });
      if (!res) return;
      selected.bike.value = '';
      selected.bikeLock.value = '';
      selected.bikeName.value = '';
      selected.bikeStudentID.value = '';
      selected.bikeStudentEmail.value = '';
      toast.success('Bike checked out');
      refreshCache();
    } catch (e) {
      toast.error(e as string);
    }
  };

  const bikesData = data as Bike[];
  const rows = [
    ...bikesData.map((bike, i) => [
      <p key={`bike-${i}`}>{bike.bike_number}</p>,
      <p key={`lock-${i}`}>{bike.lock}</p>,
      <p key={`bikename-${i}`}>{bike.student_name}</p>,
      <p key={`bikeid-${i}`}>{bike.student_id}</p>,
      <p key={`bikeemail-${i}`}>{bike.student_email}</p>,
      <p key={`bikestaff-${i}`}>{bike.rented_staff}</p>,
      <p key={`checkedout-${i}`}>
        {date.getShort(Number(bike.time_checked_out))}
      </p>,
      <p key={`bikedue-${i}`}>{date.getShort(Number(bike.time_due))}</p>,
      <p key={`renews-${i}`}>{bike.renews}</p>,
      <React.Fragment key={`actions=${i}`}>
        <Button variant='secondary'>Renew</Button>
        <Button
          variant='destructive'
          onClick={() => {
            returnBike({
              bikeNumber: bike.bike_number,
              staffName: user.email!,
            }).then(() => {
              refreshCache();
              toast.success('Bike returned');
            });
          }}
        >
          Return
        </Button>
      </React.Fragment>,
    ]),

    [
      <ComboSelector
        key={`select-bike`}
        className=''
        startingOptions={bikes}
        optionName='bikes'
        signal={selected.bike}
      />,
      <ComboSelector
        key={`select-lock`}
        className=''
        startingOptions={bikeLocks}
        optionName='bikelocks'
        signal={selected.bikeLock}
      />,
      <ComboSelector
        key={`select-bikename`}
        className=''
        startingOptions={names}
        optionName='names'
        signal={selected.bikeName}
      />,
      <Input
        key={`select-bikeid`}
        value={selected.bikeStudentID.value}
        onChange={(e) => {
          selected.bikeStudentID.value = e.target.value;
        }}
      />,
      <Input
        key={`select-bikeemail`}
        value={selected.bikeStudentEmail.value}
        onChange={(e) => {
          selected.bikeStudentEmail.value = e.target.value;
        }}
      />,
      <p key={`bikeemail`}>{getUsername(user.email!)}</p>,
      <p key={`currenttime`}>{date.currentShort()}</p>,

      <p key={`datedue`}>{date.getShort(Date.now() + 24 * 60 * 60 * 1000)}</p>,
      <p key={'renews'}>0</p>,

      <Button key={'bikecheckout'} onClick={checkout}>
        Check Out
      </Button>,
    ],
  ];
  return <Table columns={columns} rows={rows}></Table>;
};
