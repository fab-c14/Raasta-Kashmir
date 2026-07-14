# Raasta Kashmir
### **Every School Trip. Safe. Smart. Connected.**

Winner-grade AI-powered School Transport Safety Platform for Parents, Schools, Bus Drivers, and Transport Authorities (RTO) — built to run on **only the driver's phone**. No expensive IoT, no CCTV, no extra hardware.

---

## 🌟 Hackathon Highlights & Unique Innovation

While typical tracking apps rely on custom hardware or simple GPS dots, **Raasta Kashmir** implements a pure-software safety engine that operates completely from the driver's smartphone. We have designed unique features that stand out:

*   🔄 **Automatic Trip Lifecycle:** Pure hands-free operation. The trip starts automatically when the driver is outside the school premises and auto-stops once within the school zone (150m geofence), creating a zero-friction driver workflow.
*   🚦 **Dynamic Route Deviation Engine:** Supports **Route A** (school assigned route) and **Route B** (detours). If a driver diverges from Route A, the safety engine immediately flags a *Route Deviation event* and alerts school admins and parents in real time.
*   📍 **Driver Boarding & Proximity Console:** Detects approaching pickup stops. Within 400m of a stop, it alerts the driver to student boardings (e.g. *Nowhatta: Pick up Arman*) and opens a quick message bar.
- 💬 **Parent Direct Messaging:** Drivers can send quick status updates (*"Arriving in 2m"*, *"Traffic delay"*) or custom messages directly to parents in real-time.
*   🔐 **Parent-Student Invite Linkage:** Closed-loop invite codes (e.g., `STU-1`, `STU-ARMAN`) connect parents securely to student profiles. Parents can link multiple kids and switch between tabs dynamically.
*   🧠 **Persistent AI Safety Copilot:** Leverages Google Gemini to generate trip summaries, safety grading, and auto-triage parent complaints. All AI reports are cached and persisted to MongoDB/AsyncStorage, ensuring instant loads and zero token waste.

---

## ⚡ Quick Start (Demo Mode — Zero Keys Needed)

You can run and test every single feature immediately in simulated demo mode with **no API keys, database setup, or Firebase configuration**:

```bash
cp .env.example .env   # empty values are fine
npm install
npm start              # scan the QR with Expo Go
```

### **What Demo Mode Offers out-of-the-box:**
-   **Mock Authentication:** Log in instantly as any role (password: `password123`):
    -   `driver@raasta.com`
    -   `parent@raasta.com`
    -   `school@raasta.com`
    -   `rto@raasta.com`
-   **Live Simulation:** A simulated bus drives the Srinagar route (*Lal Chowk ↔ Kashmir Valley School*) with scripted events (overspeeding, route deviation, parent notifications), letting you see live map updates, ETA counts, and alerts on all dashboards.
-   **On-Device AI Heuristics:** Generates deterministic safety scores, performance reports, and triage recommendations locally.

---

## 🚀 Going Live — Environment Integration

Configure the `.env` file at the root to unlock the production-grade live stack:

| Key | Live System | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Live REST Backend | Syncs with the Express API server |
| `MONGODB_URI` | Live MongoDB | Persists trips, complaints, and linkages |
| `EXPO_PUBLIC_FIREBASE_*` | Firebase Auth | Activates real email/password authentication |
| `GEMINI_API_KEY` | Gemini AI Copilot | Activates live Gemini LLM analysis |

### **To Launch Backend Server:**
```bash
cd server
npm install
npm start        # http://localhost:4000/health verifies live services
```

---

## 📱 Roles & Features Breakdown

### 👤 1. Parent Dashboard
-   **Live Tracking:** GPS updates, bearing direction, next stops, and dynamic ETA calculations.
-   **Multi-Student Management:** Tabs to toggle tracking for multiple children linked via invite codes.
-   **Proximity Alerts:** Immiment banner notifications (*"Bus is under 500m away!"*) as the bus nears their stop.
-   **Report Concerns:** File complaints directly to the school with instant AI category and severity triage.

### 🚍 2. Bus Driver App
-   **Automated Lifecycle:** Auto-starts on login/mount if outside school; auto-ends once parked.
-   **Map & Speedometer:** Real-time speed compared against school-zone limits.
-   **Upcoming Pickups:** Displays cards with student boarding lists and parent messaging tools.
-   **Trip Summary:** View safety grades, scores, strengths, and recommendations.

### 🏫 3. School Admin Panel
-   **Fleet Monitor:** Monitor all active buses, live locations, and status tags (Live, Idle, Done, SOS).
-   **Student Directory:** Generate parent invite codes (`STU-1`, `STU-ARMAN`) and monitor connection status.
-   **AI Weekly Insights:** Summarizes fleet performance, recurring danger hotspots, and fitness alerts.
-   **Complaints Inbox:** Sort and resolve parent concerns prioritized by AI severity checks.

### 🛡️ 4. Transport Authority (RTO) Portal
-   **Compliance Dashboard:** Verify vehicle insurance, fitness certificates, and permits.
-   **Violation History:** View speed violations, SOS triggers, and unscheduled stops.
-   **Leaderboards:** Rankings of safest drivers based on historical driving telemetry.

---

## 🛠️ Architecture & Tech Stack

```
src/            Expo SDK 54 + React Native + TypeScript (clean architecture)
  api/          Axios client and API endpoints
  components/   Reusable UI elements (Cards, Score Rings, Live Map, Skeletons...)
  config/       Live/Demo env switching
  constants/    Safety guidelines, coordinates, and assigned stops
  context/      Global Contexts (Auth, Trip Lifecycle & safety engine)
  hooks/        useAppTheme, useBusTracking, usePickupProximity
  navigation/   Role-based bottom tabs and route stacks
  screens/      Role specific screens (driver, parent, school, rto, shared)
  services/     Realtime Socket.IO, tripService, and AI copilot services
  theme/        Theme palettes and Poppins typography
  utils/        Geo-math, formatting, and route deviation checkers

server/         Node.js + Express + Socket.IO + MongoDB + Gemini API
```

---

## ⚠️ Notes for Collaborators

1.  **Expo Versioning:** Pinned to **Expo SDK 54** to align with Play Store Expo Go compatibility.
2.  **Metro Cache:** If you fetch updates and experience import errors, run `npx expo start -c` to clear the cache.
3.  **Real-Time Sync:** Real-time updates utilize WebSockets via Socket.IO. When testing on a physical phone, ensure your computer and phone are connected to the same Wi-Fi network and use your local LAN IP in `EXPO_PUBLIC_API_URL`.

---

## 🔮 Future Improvements & Roadmap

*   **📱 Cross-Platform Executable Compilation:** Built on the robust React Native & Expo SDK ecosystem, the app is ready for immediate distribution as a standalone binary:
    *   **Android:** Generate installer `.apk` or Google Play `.aab` packages.
    *   **iOS:** Package to Apple TestFlight and `.ipa` distribution.
    *   **Desktop Standalones:** Can compile to desktop `.exe` or macOS `.app` runtimes using Electron-based wrappers or React Native Web.
*   **📶 Offline-First Synchronization (SQLite):** Srinagar's terrain and weather (mountain passes, heavy snow, tunnels) can cause mobile network outages. Implementing local SQLite queues will store telemetry offline on the driver's phone and automatically batch-upload to the MongoDB server once connectivity is restored.
*   **🏎️ IMU-Based Crash and Rash Driving Detection:** Access the smartphone's built-in accelerometer and gyroscope sensors to measure high G-force events (sudden impacts, harsh braking, or aggressive cornering) and trigger instant automated SOS alerts.
*   **🗺️ Smart Dynamic Route Optimizations:** AI-based routing engine that adjusts stops in real time according to weather advisories, school hours, and live traffic congestion.
*   **🎫 Mobile RFID/NFC Boarding:** Leverage the phone's native NFC sensor to allow students to scan their student ID card against the driver's phone, automating boarding checks with zero additional bus modifications.
