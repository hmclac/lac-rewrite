import { DataType } from '@/signals/Home';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  width?: string | number;
  height?: string | number;
  data: DataType;
};
export const HomePageGraph = ({
  width = '100%',
  height = 400,
  data,
}: Props) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line dataKey='count' />
        <XAxis
          dataKey='time'
          // stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        ></XAxis>
        <YAxis
          // stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        ></YAxis>
        {/* <Tooltip /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};
