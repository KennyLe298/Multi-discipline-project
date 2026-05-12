import express from 'express';
import mqtt, { MqttClient } from 'mqtt';

const app = express();
app.use(express.json());

const MQTT_BROKER = 'mqtt://mqtt.ohstem.vn:1883';
const USERNAME = 'LeHoang';
const MAX_HISTORY = 100;

interface DataPoint {
  time: string;
  value: number;
}

interface SensorState {
  temperature: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  lightIntensity: number | null;
  pumpOn: boolean;
  lightOn: boolean;
  lastUpdated: string | null;
}

const state: SensorState = {
  temperature: null,
  humidity: null,
  soilMoisture: null,
  lightIntensity: null,
  pumpOn: false,
  lightOn: false,
  lastUpdated: null,
};

const history: { humidity: DataPoint[]; light: DataPoint[] } = {
  humidity: [],
  light: [],
};

const client: MqttClient = mqtt.connect(MQTT_BROKER, {
  username: USERNAME,
  password: '',
  clientId: `yolofarm_server_${Math.random().toString(16).slice(2, 8)}`,
  clean: true,
});

client.on('connect', () => {
  console.log('Backend connected to MQTT broker');
  client.subscribe(`${USERNAME}/feeds/V1`);
  client.subscribe(`${USERNAME}/feeds/V2`);
  client.subscribe(`${USERNAME}/feeds/V3`);
  client.subscribe(`${USERNAME}/feeds/V4`);
  client.subscribe(`${USERNAME}/feeds/V10`);
  client.subscribe(`${USERNAME}/feeds/V11`);
});

client.on('message', (topic: string, message: Buffer) => {
  const raw = message.toString();
  const value = parseFloat(raw);
  const now = new Date().toISOString();

  state.lastUpdated = now;

  if (topic === `${USERNAME}/feeds/V1` && !isNaN(value)) state.temperature = value;
  if (topic === `${USERNAME}/feeds/V2` && !isNaN(value)) {
    state.humidity = value;
    history.humidity = [...history.humidity.slice(-(MAX_HISTORY - 1)), { time: now, value }];
  }
  if (topic === `${USERNAME}/feeds/V3` && !isNaN(value)) state.soilMoisture = value;
  if (topic === `${USERNAME}/feeds/V4` && !isNaN(value)) {
    state.lightIntensity = value;
    history.light = [...history.light.slice(-(MAX_HISTORY - 1)), { time: now, value }];
  }
  if (topic === `${USERNAME}/feeds/V10`) state.pumpOn = raw === '1';
  if (topic === `${USERNAME}/feeds/V11`) state.lightOn = raw === '1';
});

client.on('error', (err: Error) => console.error('MQTT error:', err.message));

// GET /api/status — current sensor readings and actuator states
app.get('/api/status', (_req, res) => {
  res.json(state);
});

// GET /api/history — historical sensor readings (last MAX_HISTORY points)
app.get('/api/history', (_req, res) => {
  res.json(history);
});

// POST /api/pump — manually control water pump
// Body: { "on": true } or { "on": false }
app.post('/api/pump', (req, res) => {
  const { on } = req.body as { on: boolean };
  if (typeof on !== 'boolean') {
    res.status(400).json({ error: 'Body must contain { "on": boolean }' });
    return;
  }
  client.publish(`${USERNAME}/feeds/V10`, on ? '1' : '0');
  state.pumpOn = on;
  res.json({ success: true, pumpOn: on });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`YoloFarm3 backend running on http://localhost:${PORT}`);
  console.log(`  GET  /api/status   — current sensor values`);
  console.log(`  GET  /api/history  — sensor reading history`);
  console.log(`  POST /api/pump     — control water pump`);
});
