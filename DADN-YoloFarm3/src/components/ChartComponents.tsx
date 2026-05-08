import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { DataPoint } from '../lib/useMqtt';

const fallbackHumidity = [
  { time: '00:00', value: 45 },
  { time: '02:00', value: 52 },
  { time: '04:00', value: 48 },
  { time: '06:00', value: 65 },
  { time: '08:00', value: 72 },
  { time: '10:00', value: 58 },
  { time: '12:00', value: 50 },
  { time: '14:00', value: 42 },
  { time: '16:00', value: 48 },
  { time: '18:00', value: 68 },
  { time: '20:00', value: 75 },
  { time: '22:00', value: 62 },
  { time: '23:59', value: 55 },
];

const fallbackLight = [
  { time: '06:00', value: 200 },
  { time: '08:00', value: 450 },
  { time: '10:00', value: 700 },
  { time: '12:00', value: 850 },
  { time: '14:00', value: 800 },
  { time: '16:00', value: 600 },
  { time: '18:00', value: 300 },
];

const historicalHumidity = [
  { date: '01 Oct', value: 60 },
  { date: '04 Oct', value: 62 },
  { date: '07 Oct', value: 58 },
  { date: '10 Oct', value: 65 },
  { date: '14 Oct', value: 78 },
  { date: '17 Oct', value: 55 },
  { date: '21 Oct', value: 72 },
  { date: 'Today', value: 64 },
];

const historicalLight = [
  { date: '01 Oct', value: 30 },
  { date: '04 Oct', value: 45 },
  { date: '07 Oct', value: 35 },
  { date: '10 Oct', value: 50 },
  { date: '14 Oct', value: 42 },
  { date: '17 Oct', value: 55 },
  { date: '21 Oct', value: 38 },
  { date: 'Today', value: 42.8 },
];

interface ChartProps {
  data?: DataPoint[];
}

export const HumidityBarChart = ({ data }: ChartProps) => {
  const chartData = data && data.length > 0 ? data : fallbackHumidity;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <Bar dataKey="value" fill="#67bafd" radius={[4, 4, 0, 0]} />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#414941' }}
          interval="preserveStartEnd"
        />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const LightLineChart = ({ data }: ChartProps) => {
  const chartData = data && data.length > 0 ? data : fallbackLight;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#644700"
          strokeWidth={3}
          dot={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const LargeHumidityChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={historicalHumidity}>
      <defs>
        <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#006399" stopOpacity={0.1}/>
          <stop offset="95%" stopColor="#006399" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke="#006399"
        strokeWidth={3}
        fillOpacity={1}
        fill="url(#colorHum)"
      />
      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#414941' }}
      />
      <Tooltip
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const LargeLightChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={historicalLight}>
      <defs>
        <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#644700" stopOpacity={0.1}/>
          <stop offset="95%" stopColor="#644700" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke="#644700"
        strokeWidth={3}
        fillOpacity={1}
        fill="url(#colorLight)"
      />
      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#414941' }}
      />
      <Tooltip
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      />
    </AreaChart>
  </ResponsiveContainer>
);