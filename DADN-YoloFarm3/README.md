# YoloFarm3 — Smart Agriculture IoT Dashboard

A real-time smart agriculture monitoring and control system. The web application consists of a **Node.js/Express backend** that bridges an MQTT broker to a **React frontend** dashboard.

## System Architecture

```
YoloUno (ESP32-S3)
    │  MQTT TCP :1883
    ▼
mqtt.ohstem.vn  (MQTT Broker)
    │  MQTT TCP :1883
    ▼
Backend Server  (Node.js + Express, port 3001)
    │  REST API (HTTP)
    ▼
React Frontend  (Vite, port 3000)
    │
    ▼
Browser (Chrome / Safari / Firefox)
```

The backend subscribes to MQTT feeds, caches sensor state in memory, and exposes REST API endpoints. The frontend polls those endpoints every 5 seconds — no MQTT credentials are ever sent to the browser.

## Features

- **Real-time monitoring** — temperature, humidity, soil moisture, light intensity (updated every 30 s from device)
- **Automated irrigation** — pump activates when soil moisture < 50%, deactivates when > 80%
- **Scheduled grow lighting** — on during 07:00–07:15 and 14:00–14:30 (UTC+7)
- **Manual pump control** — toggle from dashboard via `POST /api/pump`
- **History charts** — sliding-window humidity & light history (last 100 readings)
- **Data export** — PDF report or raw CSV
- **Responsive UI** — desktop sidebar + mobile bottom nav

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (bundled with Node.js)

## Getting Started

### 1. Install dependencies

```bash
cd DADN-YoloFarm3
npm install
```

### 2. Run the backend

```bash
npm run server
```

The backend starts on `http://localhost:3001` and immediately connects to the MQTT broker.

### 3. Run the frontend (separate terminal)

```bash
npm run dev
```

The frontend starts on `http://localhost:3000`. Vite proxies all `/api` requests to the backend automatically.

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Latest sensor readings and actuator states |
| `GET` | `/api/history` | Humidity and light intensity history arrays |
| `POST` | `/api/pump` | Control water pump — body: `{ "on": true \| false }` |

### Example responses

**GET /api/status**
```json
{
  "temperature": 28.3,
  "humidity": 47.2,
  "soilMoisture": 0.0,
  "lightIntensity": 2805,
  "pumpOn": false,
  "lightOn": false,
  "lastUpdated": "2026-05-12T10:45:00.000Z"
}
```

**POST /api/pump**
```json
// Request body
{ "on": true }

// Response
{ "success": true, "pumpOn": true }
```

## Project Structure

```
DADN-YoloFarm3/
├── server.ts                  # Express backend — MQTT bridge + REST API
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Root component, view routing
│   ├── index.css              # Tailwind CSS
│   ├── lib/
│   │   ├── useApi.ts          # Hook: polls backend REST API every 5 s
│   │   └── utils.ts           # Utility functions
│   └── components/
│       ├── Overview.tsx       # Real-time dashboard view
│       ├── History.tsx        # Historical trend view
│       ├── ChartComponents.tsx# Recharts wrappers
│       ├── ExportModal.tsx    # PDF / CSV export dialog
│       ├── Sidebar.tsx        # Desktop navigation
│       └── TopBar.tsx         # Mobile top bar
├── package.json
├── vite.config.ts             # Vite + /api proxy to :3001
└── index.html
```

## MQTT Topics

| Feed | Direction | Payload | Description |
|------|-----------|---------|-------------|
| `LeHoang/feeds/V1` | Device → Backend | Float | Temperature (°C) |
| `LeHoang/feeds/V2` | Device → Backend | Float | Humidity (%) |
| `LeHoang/feeds/V3` | Device → Backend | Float | Soil moisture (%) |
| `LeHoang/feeds/V4` | Device → Backend | Float | Light intensity (lux) |
| `LeHoang/feeds/V10` | Bidirectional | `'1'`/`'0'` | Water pump state |
| `LeHoang/feeds/V11` | Device → Backend | `'1'`/`'0'` | Grow light state |

Broker: `mqtt.ohstem.vn:1883` — username `LeHoang`, no password.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express 4, `mqtt` npm package |
| Frontend | React 19 + TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
