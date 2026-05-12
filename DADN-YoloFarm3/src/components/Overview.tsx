import React from 'react';
import { Thermometer, Droplets, Sprout, Sun, Zap, Wifi, WifiOff } from 'lucide-react';
import { HumidityBarChart, LightLineChart } from './ChartComponents';
import { motion } from 'motion/react';
import { useApi } from '../lib/useApi';

export const Overview: React.FC = () => {
  const { data, setPump } = useApi();

  const fmt = (v: number | null, decimals = 1) =>
    v === null ? '—' : Number(v).toFixed(decimals);

  const handlePumpToggle = () => {
    const next = !data.pumpOn;
    setPump(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">YoloFarm3 Overview</h1>
          <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs">Real-time precision monitoring</p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest px-3 py-1 rounded-full ${data.connected ? 'text-green-600 bg-green-50' : 'text-red-400 bg-red-50'}`}>
          {data.connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {data.connected ? 'Live' : 'Connecting…'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Temperature"
          value={fmt(data.temperature)}
          unit="°C"
          icon={<Thermometer className="text-primary" />}
          bgIcon={<Thermometer className="absolute -right-4 -bottom-4 w-24 h-24 text-on-surface/5" />}
        />
        <StatCard
          label="Humidity"
          value={fmt(data.humidity)}
          unit="%"
          icon={<Droplets className="text-secondary" />}
          bgIcon={<Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-on-surface/5" />}
        />
        <StatCard
          label="Soil Moisture"
          value={fmt(data.soilMoisture, 0)}
          unit="%"
          icon={<Sprout className="text-primary" />}
          bgIcon={<Sprout className="absolute -right-4 -bottom-4 w-24 h-24 text-on-surface/5" />}
        />
        <StatCard
          label="Light Intensity"
          value={fmt(data.lightIntensity, 0)}
          unit="lux"
          icon={<Sun className="text-tertiary" />}
          bgIcon={<Sun className="absolute -right-4 -bottom-4 w-24 h-24 text-on-surface/5" />}
        />
      </div>

      {/* Main Charts & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold font-headline text-on-surface">Humidity History</h3>
            <span className="text-xs font-label text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Last 20 readings</span>
          </div>
          <div className="h-64 w-full">
            <HumidityBarChart data={data.humidityHistory} />
          </div>
        </div>

        <div className="space-y-8">
          {/* Water Pump Control */}
          <div className="bg-primary p-8 rounded-xl text-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold font-headline">Water Pump</h3>
                <p className="text-xs font-label opacity-70 uppercase tracking-widest">Active Irrigation</p>
              </div>
              <Zap className="opacity-50" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-black font-headline">{data.pumpOn ? 'ON' : 'OFF'}</span>
              <button
                onClick={handlePumpToggle}
                className={`w-14 h-8 rounded-full transition-all relative ${data.pumpOn ? 'bg-white/30' : 'bg-black/20'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${data.pumpOn ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Light History Small */}
          <div className="bg-surface-container-lowest p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-headline text-on-surface">Light History</h3>
              <Sun size={16} className="text-tertiary" />
            </div>
            <div className="h-32 w-full">
              <LightLineChart data={data.lightHistory} />
            </div>
            <p className="text-[10px] font-label text-on-surface-variant text-center mt-4 uppercase tracking-widest">
              {data.lightIntensity !== null ? `Latest: ${fmt(data.lightIntensity, 0)} lux` : 'Awaiting data…'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, unit, icon, bgIcon }: any) => (
  <div className="bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden group transition-all hover:bg-white">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-black font-headline text-on-surface">{value}</span>
      <span className="text-sm font-label text-on-surface-variant font-bold">{unit}</span>
    </div>
    {bgIcon}
  </div>
);