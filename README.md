# Raasta Kashmir

### *Every School Trip. Safe. Smart. Connected.*

Raasta Kashmir is an AI-powered School Transport Safety Platform built using React Native and Expo. It is designed to modernize and secure school transportation without requiring external IoT sensors, CCTV, or extra hardware—relying entirely on the driver's Android phone.

The platform provides dedicated, custom dashboards for four main user groups:
*   **Drivers**: Start/end trips, view active routes, monitor speed, view AI safety scores, and trigger emergency SOS signals.
*   **Parents**: Track assigned school buses in real-time, view dynamic ETAs, and receive immediate safety/SOS alerts.
*   **Schools**: Monitor fleet locations, review driver performance rankings, and analyze safety logs.
*   **Road Transport Office (RTO)**: View vehicle compliance, check speed violation histories, and inspect safety diagnostics.

---

## 🛠 Tech Stack

### Frontend & UI
*   **Framework**: React Native with Expo (v57.0.0)
*   **Design System**: React Native Paper (Material 3 inspired)
*   **Navigation**: React Navigation (Stack)
*   **Typography**: Poppins Font (Weights 300, 400, 500, 600, 700)
*   **Icons**: Lucide Icons (lucide-react-native)
*   **Animations**: React Native Reanimated

### Backend & Services
*   **State Management**: Context API
*   **Authentication**: Firebase Auth (with automatic persistent local mock-mode fallback)
*   **Storage**: `@react-native-async-storage/async-storage`

---

## 📁 Project Structure

This project follows **Clean Architecture** principles:

```
src/
├── config/       # Configuration layers (Firebase, environment)
├── context/      # Global state providers (Auth, Navigation states)
├── theme/        # Centralized theme palettes and spacing configurations
├── types/        # TypeScript interface definitions
├── services/     # API connection and authentication logic
├── screens/      # Dynamic role-based user interfaces
├── navigation/   # Type-safe router stack setups
└── hooks/        # Custom reusable React hooks (e.g. useAppTheme)
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [Expo Go](https://expo.dev/client) app installed on your physical device (Android or iOS)

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/fab-c14/Raasta-Kashmir.git
    cd Raasta-Kashmir
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Metro Bundler**:
    ```bash
    npm run start
    ```

### Running on a Device
*   **Physical Android / iOS device**: Scan the QR code printed in the terminal using the **Expo Go** application. Ensure both your computer and phone are connected to the same local Wi-Fi.
*   **Emulator**: Press `a` in your terminal to boot up an Android Emulator, or `i` for iOS Simulator.

---

## 🔑 Demo Access Logins (Mock Authentication)

For the hackathon demonstration, the application launches in **Mock Authentication** mode automatically if custom Firebase configurations are absent. Use the following profiles to inspect role portals (default password: `password123`):

| Role | Demo Email | Core Dashboard Feature |
| :--- | :--- | :--- |
| **Driver** | `driver@raasta.com` | Speed dial, active trip controller, SOS trigger |
| **Parent** | `parent@raasta.com` | Real-time ETA, bus status logs, driver safety badges |
| **School** | `school@raasta.com` | Fleet active counter, driver ranking statistics |
| **RTO Authority** | `rto@raasta.com` | Srinagar compliance metrics, speed violations report logs |
