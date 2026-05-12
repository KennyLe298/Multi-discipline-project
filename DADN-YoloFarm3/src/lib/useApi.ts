import { useState, useEffect, useCallback, useRef } from 'react';
import { DataPoint } from './useMqtt';

export interface FarmStatus {
  temperature: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  lightIntensity: number | null;
  pumpOn: boolean;
  lightOn: boolean;
  lastUpdated: string | null;
  connected: boolean;
}

const POLL_INTERVAL_MS = 5000;

export function useApi() {
  const [status, setStatus] = useState<FarmStatus>({
    temperature: null,
    humidity: null,
    soilMoisture: null,
    lightIntensity: null,
    pumpOn: false,
    lightOn: false,
    lastUpdated: null,
    connected: false,
  });
  const [humidityHistory, setHumidityHistory] = useState<DataPoint[]>([]);
  const [lightHistory, setLightHistory] = useState<DataPoint[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('status not ok');
      const data = await res.json();
      setStatus({ ...data, connected: true });
    } catch {
      setStatus(prev => ({ ...prev, connected: false }));
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) return;
      const data = await res.json();
      if (data.humidity) {
        setHumidityHistory(
          data.humidity.map((p: { time: string; value: number }) => ({
            time: new Date(p.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: p.value,
          }))
        );
      }
      if (data.light) {
        setLightHistory(
          data.light.map((p: { time: string; value: number }) => ({
            time: new Date(p.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: p.value,
          }))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
    timerRef.current = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStatus, fetchHistory]);

  const setPump = useCallback(async (on: boolean) => {
    try {
      await fetch('/api/pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ on }),
      });
      setStatus(prev => ({ ...prev, pumpOn: on }));
    } catch {
      // ignore
    }
  }, []);

  return {
    data: {
      ...status,
      humidityHistory,
      lightHistory,
    },
    setPump,
  };
}
