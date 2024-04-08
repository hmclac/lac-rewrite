import { signal } from '@preact/signals-react';

export type DataType = { time: string; count: number }[];

export const data = signal<DataType>([]);
