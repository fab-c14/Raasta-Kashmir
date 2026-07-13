# Raasta Kashmir

**Every School Trip. Safe. Smart. Connected.**

An AI-powered School Transport Safety Platform for Parents, Schools, Bus Drivers and Transport Authorities (RTO) — built to work with **only the driver's Android phone**. No IoT, no CCTV, no extra hardware.

## Quick start (demo mode — zero keys needed)

```bash
cp .env.example .env   # empty values are fine
npm install
npm start              # scan the QR with Expo Go (Android)
```

With an empty `.env` the entire platform runs live and self-contained:

- **Mock auth** — log in as any role: `driver@raasta.com`, `parent@raasta.com`, `school@raasta.com`, `rto@raasta.com` (password `password123`), or sign up.
- **Simulated bus** — a demo bus drives the Srinagar route (Lal Chowk → Kashmir Valley School) in real time with scripted overspeed + long-stop events, so parent/school/RTO dashboards are alive instantly.
- **Driver GPS** — real phone GPS when permission is granted; automatic drive simulation on emulators.
- **On-device AI fallback** — safety scores, trip summaries, complaint triage and weekly insights are generated deterministically from telemetry.

## Going live — everything is switched by `.env` alone

| Set in `.env` | What switches to live |
| --- | --- |
| `EXPO_PUBLIC_API_URL` (+ optional `EXPO_PUBLIC_SOCKET_URL`) | REST + Socket.IO realtime via the Express server |
| `MONGODB_URI` | Trip/complaint persistence in MongoDB (else in-memory) |
| `GEMINI_API_KEY` | Real Gemini AI Safety Copilot (else heuristic fallback) |
| `EXPO_PUBLIC_FIREBASE_*` | Real Firebase Authentication (else mock auth) |

Run the backend (reads the **same root `.env`**):

```bash
cd server
npm install
npm start        # http://localhost:4000/health shows db + ai mode
```

Then set `EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:4000` and restart Expo.

## Roles & features

- **Driver** — start/end trip, live map + speed vs limit, live AI safety score, emergency SOS, AI trip summary & safety review, trip history.
- **Parent** — live bus tracking, ETA + next stop, realtime safety alerts (overspeed / long stop / route deviation / SOS), driver safety score, AI-triaged complaint submission.
- **School** — fleet monitor with live buses, SOS banner, complaints with AI categorization, driver rankings, AI weekly insights.
- **RTO** — compliance dashboard (fitness/insurance/permit), violation history, driver rankings, fleet analytics.

## Architecture

```
src/            Expo SDK 57 + React Native + TypeScript (clean architecture)
  api/          axios client
  components/   reusable UI (cards, skeletons, score ring, live map…)
  config/       env switching (demo ↔ live)
  constants/    safety thresholds, demo route
  context/      Auth, Trip (GPS + detection engine)
  hooks/        useAppTheme, useBusTracking
  navigation/   role-based bottom tabs + stacks
  screens/      driver / parent / school / rto / shared
  services/     realtime (Socket.IO ↔ simulator), trips, AI copilot
  theme/        palette, typography (Poppins), Paper/Navigation themes
  types/        strict domain types (no `any`)
  utils/        geo math, trip safety monitor, formatting

server/         Node + Express + Socket.IO + MongoDB + Gemini
```

Safety detection (overspeed, long-stop, route-deviation with cooldowns) runs on the driver's phone from pure GPS — the core hackathon constraint. The same engine (`src/utils/tripMonitor.ts`) powers the demo simulator and the live driver app.

## Demo logins (mock auth, password `password123`)

| Role | Email |
| --- | --- |
| Driver | `driver@raasta.com` |
| Parent | `parent@raasta.com` |
| School | `school@raasta.com` |
| RTO | `rto@raasta.com` |
