import { signal } from '@preact/signals-react';

export const currentTime = signal(
  new Date().toLocaleTimeString([], { timeStyle: 'short' })
);

export const updateTime = () => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString([], {
      timeStyle: 'short',
    });
  }, 10 * 1000);
};

const equipment = signal('');

const equipmentName = signal('');

const equipmentStudentID = signal('');

const equipmentStudentEmail = signal('');

const bike = signal('');

const bikeLock = signal('')

const bikeName = signal('');

const bikeStudentID = signal('');

const bikeStudentEmail = signal('');

export const selected = {
  equipment,
  equipmentName,
  equipmentStudentID,
  equipmentStudentEmail,
  bike,
  bikeLock,
  bikeName,
  bikeStudentID,
  bikeStudentEmail,
};
