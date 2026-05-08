import React from 'react';
import { Cloud, Radio, CheckCircle, Droplets, Sun } from 'lucide-react';
import { LargeHumidityChart, LargeLightChart } from './ChartComponents';
import { motion } from 'motion/react';
import { useMqtt } from '../lib/useMqtt';

export const HistoryView: React.FC = () => {
  const { data } = useMqtt();

  const avgHumidity = data.humidityHistory.length > 0 
    ? (data.humidityHistory.reduce((acc, curr) => acc + curr.value, 0) / data.humidityHistory.length).toFixed(1)
    : '64.2';

  const avgLight = data.lightHistory.length > 0
    ? (data.lightHistory.reduce((acc, curr) => acc + curr.value, 0) / data.lightHistory.length).toFixed(1)
    : '42.8';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Historical Insights</h1>
          <p className="text-on-surface-variant font-label max-w-lg">Advanced longitudinal analysis of environmental variables for the North Sector fields over the last 30 days.</p>
        </div>
        <div className="flex gap-3 bg-surface-container p-1 rounded-full">
          <button className="px-6 py-2 rounded-full bg-surface-container-lowest text-on-surface shadow-sm font-semibold text-sm transition-all">30 Days</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-all">90 Days</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-all">1 Year</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Humidity History */}
        <section className="bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <Droplets size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline text-on-surface">Humidity History</h3>
                <p className="text-sm font-label text-on-surface-variant">Average relative humidity (%)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black font-headline text-secondary">{avgHumidity}%</div>
              <div className="text-[10px] font-label text-secondary font-bold uppercase tracking-wider">Avg. Monthly</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <LargeHumidityChart data={data.humidityHistory} />
          </div>
        </section>

        {/* Light History */}
        <section className="bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                <Sun size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline text-on-surface">Light Intensity History</h3>
                <p className="text-sm font-label text-on-surface-variant">Luminous flux density (kLux)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black font-headline text-tertiary">{avgLight}</div>
              <div className="text-[10px] font-label text-tertiary font-bold uppercase tracking-wider">Avg. Daily kLux</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <LargeLightChart data={data.lightHistory} />
          </div>
        </section>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SummaryCard label="Data Uptime" value="99.98%" icon={<Cloud className="text-primary/40" size={40} />} color="text-primary" />
          <SummaryCard label="Active Sensors" value="124" icon={<Radio className="text-primary/40" size={40} />} color="text-primary" />
          <SummaryCard label="Anomalies" value="0" icon={<CheckCircle className="text-error/40" size={40} />} color="text-error" />
        </div>
      </div>
    </motion.div>
  );
};

const SummaryCard = ({ label, value, icon, color }: any) => (
  <div className="bg-surface-container rounded-xl p-6 flex items-center justify-between">
    <div>
      <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant tracking-widest">{label}</span>
      <div className={`text-2xl font-black font-headline ${color}`}>{value}</div>
    </div>
    {icon}
  </div>
);
