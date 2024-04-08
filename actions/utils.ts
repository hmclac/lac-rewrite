import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUsername = (email: string) => email.split('@')[0];

export const time = {
  currentShort: () =>
    new Date().toLocaleTimeString([], {
      timeStyle: 'short',
    }),
  getShort: (date: number) =>
    new Date(date).toLocaleTimeString([], { timeStyle: 'short' }),
  getDay: (date: number) =>
    Math.round(
      (date - new Date('01/01/2024').getTime()) / (1000 * 60 * 60 * 24)
    ),
};

export const date = {
  getShort: (date: number) => new Date(date).toLocaleDateString(),
  currentShort: () => new Date().toLocaleDateString(),
};
