import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

const BROKER = 'ws://mqtt.ohstem.vn:8083/mqtt';
const USERNAME = 'LeHoang';
const PASSWORD = '';

export interface DataPoint {
  time: string;
  value: number;
}

export interface FarmData {
  temperature: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  lightIntensity: number | null;
  pumpOn: boolean;
  humidityHistory: DataPoint[];
  lightHistory: DataPoint[];
  connected: boolean;
}

const INITIAL: FarmData = {
  temperature: null,
  humidity: null,
  soilMoisture: null,
  lightIntensity: null,
  pumpOn: false,
  humidityHistory: [],
  lightHistory: [],
  connected: false,
};

export function useMqtt() {
  const [data, setData] = useState<FarmData>(INITIAL);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(BROKER, {
      username: USERNAME,
      password: PASSWORD,
      clientId: `yolofarm_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
    });
    clientRef.current = client;

    client.on('connect', () => {
      setData(d => ({ ...d, connected: true }));
      client.subscribe(`${USERNAME}/feeds/V1`);
      client.subscribe(`${USERNAME}/feeds/V2`);
      client.subscribe(`${USERNAME}/feeds/V3`);
      client.subscribe(`${USERNAME}/feeds/V4`);
      client.subscribe(`${USERNAME}/feeds/V10`);
    });

    client.on('error', () => setData(d => ({ ...d, connected: false })));
    client.on('close', () => setData(d => ({ ...d, connected: false })));

    client.on('message', (topic, message) => {
      const raw = message.toString();
      const value = parseFloat(raw);
      if (isNaN(value)) return;

      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      setData(prev => {
        const next = { ...prev };
        if (topic === `${USERNAME}/feeds/V1`) next.temperature = value;
        if (topic === `${USERNAME}/feeds/V2`) {
          next.humidity = value;
          next.humidityHistory = [...prev.humidityHistory.slice(-19), { time: now, value }];
        }
        if (topic === `${USERNAME}/feeds/V3`) next.soilMoisture = value;
        if (topic === `${USERNAME}/feeds/V4`) {
          next.lightIntensity = value;
          next.lightHistory = [...prev.lightHistory.slice(-19), { time: now, value }];
        }
        if (topic === `${USERNAME}/feeds/V10`) next.pumpOn = raw === '1';
        return next;
      });
    });

    return () => { client.end(); };
  }, []);

  const setPump = useCallback((on: boolean) => {
    clientRef.current?.publish(`${USERNAME}/feeds/V10`, on ? '1' : '0');
  }, []);

  return { data, setPump };
}