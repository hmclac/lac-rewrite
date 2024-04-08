'use client';
'use strict';
import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSignals } from '@preact/signals-react/runtime';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { UserType } from '@/components/SessionProvider';
import { ComboSelector } from '@/components/ComboSelector';
import { Table } from '@/components/Employee/Table';

import { currentTime, selected, updateTime } from '@/signals/Employee';
import { time, getUsername } from '@/actions/utils';
import {
  fetchEquipment,
  handleEquipmentCheckOut,
  returnBike,
  returnEquipment,
} from '@/actions/client/firestore';

const sampleEquipment = ['basketball', 'pool', 'ping pong', 'volleyball'];

const names = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'];

const columns = [
  'Equipment Type',
  'Student Name',
  'Student ID',
  'Email',
  'Time Checked Out',
  'Rented By',
  'Actions',
];

type Props = {
  user: UserType;
};

type Checkout = {
  equipment_type: string;
  rented_staff: string;
  returned_staff?: string;
  student_email: string;
  student_id: string;
  student_name: string;
  time_checked_in?: string;
  time_checked_out: string;
};

export const Equipment = (props: Props) => {
  const { user } = props;
  useSignals();
  updateTime();

  const queryClient = useQueryClient();

  const refreshCache = () =>
    queryClient.invalidateQueries({ queryKey: ['equipment'] });
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: fetchEquipment,
  });
  if (isPending || isError) return <p>{error?.message}</p>;

  const checkout = async () => {
    try {
      const res = await handleEquipmentCheckOut({
        equipmentType: selected.equipment.value,
        studentName: selected.equipmentName.value,
        studentID: selected.equipmentStudentID.value,
        studentEmail: selected.equipmentStudentEmail.value,
        staffName: getUsername(user.email!),
      });
      if (!res) return;
      selected.equipment.value = '';
      selected.equipmentName.value = '';
      selected.equipmentStudentID.value = '';
      selected.equipmentStudentEmail.value = '';
      toast.success('Equipment checked out');
      refreshCache();
    } catch (e) {
      toast.error(e as string);
    }
  };

  const equipment = data as Checkout[];
  const rows = [
    ...equipment.map((e, i) => [
      <p key={`type-${i}`}>{e.equipment_type}</p>,
      <p key={`name-${i}`}>{e.student_name}</p>,
      <p key={`id-${i}`}>{e.student_id}</p>,
      <p key={`email-${i}`}>{e.student_email}</p>,
      <p key={`time-${i}`}>{time.getShort(Number(e.time_checked_out))}</p>,
      <p key={`staff-${i}`}>{e.rented_staff}</p>,
      <Button
        key={`return-${i}`}
        variant='destructive'
        onClick={() => {
          returnEquipment({
            equipmentType: e.equipment_type,
            staffName: getUsername(user.email!),
            student_id: e.student_id,
          }).then(() => {
            refreshCache();
            toast.success('Equipment returned');
          });
        }}
      >
        Return
      </Button>,
    ]),

    [
      <ComboSelector
        key={`select-equipment`}
        className=''
        startingOptions={sampleEquipment}
        optionName='equipment'
        signal={selected.equipment}
      />,
      <ComboSelector
        key={`select-name`}
        className=''
        startingOptions={names}
        optionName='names'
        signal={selected.equipmentName}
      />,
      <Input
        key={`select-id`}
        value={selected.equipmentStudentID.value}
        onChange={(e) => {
          selected.equipmentStudentID.value = e.target.value;
        }}
      />,
      <Input
        key={`select-email`}
        value={selected.equipmentStudentEmail.value}
        onChange={(e) => {
          selected.equipmentStudentEmail.value = e.target.value;
        }}
      />,

      <p key={`time`}>{currentTime}</p>,

      <p key={`username`}>{getUsername(user.email!)}</p>,
      <Button key={`checkout`} onClick={checkout}>
        Check Out
      </Button>,
    ],
  ];
  return <Table columns={columns} rows={rows}></Table>;
};
