# 🚩 YatraGuard — Intelligent Pilgrimage Safety & Crowd Management Platform

<div align="center">

![YatraGuard Banner](https://img.shields.io/badge/YatraGuard-Pilgrimage%20Safety%20%26%20Smart%20Darshan-FF6F00?style=for-the-badge&logo=shield&logoColor=white)

[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native 0.81](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Assistant-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A unified, real-time safety ecosystem for Hindu pilgrimage destinations across India, empowering both pilgrims and temple administration authorities with live crowd telemetry, interactive maps, safer route alternatives, emergency SOS broadcasting, family tracking, and AI-powered pilgrimage guidance.**

[✨ Key Features](#-key-features) • [🏛️ Supported Sacred Destinations](#-supported-sacred-destinations) • [📱 App Modules & Architecture](#-app-modules--architecture) • [🚀 Quick Start](#-quick-start) • [🔗 Useful Links & Navigation](#-useful-links--repository-navigation)

</div>

---

## 📖 Overview

Millions of pilgrims undertake journeys to sacred shrines like **Tirumala, Varanasi, Prayagraj, and Rameswaram** every year. Major choke points, sudden stampede risks, unexpected weather surges, lost elderly/children, and lack of live queue information create severe hazards.

**YatraGuard** bridges this critical gap with a dual-mode application designed specifically for:
1. **Pilgrims & Families:** Real-time crowd density alerts, smart queue wait times, AI darshan scheduling, offline-ready maps, safe alternative exploration, lodging/food finders, and one-tap SOS.
2. **Temple & Police Authorities:** Command & Control Dashboard for instant crowd capacity updates, gate closures/restrictions, surge forecasts, transport status controls, and rapid emergency dispatch response.

---

## ✨ Key Features

### 👤 Pilgrim Experience

- **🔴 Live Crowd Telemetry & Heatmap:** Real-time occupancy levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`, `DANGEROUS`), estimated darshan wait times, and bottleneck indicators.
- **🛡️ Dynamic Safer Alternative Routing:** Automatically suggests tranquil, lower-density temple shrines and viewing points when main sanctums hit critical capacity.
- **👨‍👩‍👧‍👦 Family Hub & Live Tracker:** Share location securely with family members, set designated emergency rendezvous points, view member battery status, and receive geofence safety alerts.
- **🚨 Instant SOS & Emergency Response:** 1-tap SOS distress beacon with SMS fallback containing live GPS coordinates, direct dialer for Police (`112`), Medical Emergency (`108`), Women's Helpline (`1090`), and local Temple Devasthanam desks.
- **🤖 YatraGuard AI Pilgrimage Guide:** Powered by Google Gemini AI with multilingual capability and offline fallback. Provides smart darshan planning, senior-friendly route tips, Annadanam (free meals) locations, and weather-aware advice.
- **🚌 Transit & Logistics Compass:** Live transport conditions (RTC buses, Ghat road shuttles, battery vehicles, train stations) with delay advisories and fare estimations.
- **🛏️ Stay & Free Amenities Finder:** Direct directory of TTD/Temple Choultries, Dharamshalas, locker rooms, medical booths, and Annadanam food counters.

### 👮 Authority & Administration Command Dashboard

- **📊 Live Capacity & Darshan Queue Manager:** Real-time sliders to modify live pilgrim counts and trigger automatic high-crowd warnings across pilgrim devices.
- **🚧 Instant Gate & Area Restrictions:** Restrict pathways, narrow corridors, or sanctum gates in 1-click to divert foot traffic instantly.
- **📢 Real-time Emergency Broadcasts:** Issue instant priority notifications (Stampede Hazard, Weather Warning, Missing Child alert).
- **🚨 SOS Dispatch & Resolution Tracker:** Active feed of triggered pilgrim emergencies with exact coordinates, caller details, and status resolution workflows.
- **🔮 24-Hour Surge Predictive Insights:** Anticipate rush hours (festivals, Brahmotsavams, Aarti timings, weekends) to preemptively deploy security forces.

---

## 🏛️ Supported Sacred Destinations

| Destination | State | Key Landmarks Covered |
| :--- | :--- | :--- |
| **🕉️ Tirumala & Tirupati** | Andhra Pradesh | Sri Venkateswara Swamy Temple, Kapila Theertham, Silathoranam, Alipiri Footpath, Akasa Ganga, Srivari Mettu |
| **🪔 Varanasi (Kashi)** | Uttar Pradesh | Kashi Vishwanath Temple, Dashashwamedh Ghat, Assi Ghat, Manikarnika Ghat, Sarnath Stupa, Kaal Bhairav |
| **🌊 Prayagraj (Sangam)** | Uttar Pradesh | Triveni Sangam, Bade Hanuman Ji Temple, Akshayavat, Anand Bhavan, Alopi Devi Temple |
| **🐚 Rameswaram** | Tamil Nadu | Ramanathaswamy Temple, Agni Theertham, 22 Holy Theerthams, Dhanushkodi Beach & Ghost Town, APJ Abdul Kalam Memorial |

---

## 📱 App Modules & Architecture

```
YatraGuard-Pilgrimage-Safety-App/
├── app/                              # Expo Router file-based navigation
│   ├── (tabs)/                       # Pilgrim Tab Navigation
│   │   ├── index.tsx                 # Home Dashboard (Live status, quick actions, weather)
│   │   ├── crowd.tsx                 # Real-time Crowd Heatmap & Queue Wait Times
│   │   ├── explore.tsx               # Spiritual Heritage & Safer Alternatives
│   │   ├── ai.tsx                    # Gemini-powered AI Yatra Assistant
│   │   └── profile.tsx               # User Settings, Emergency Contacts & Preferences
│   ├── authority/
│   │   └── dashboard.tsx             # Command & Control Dashboard for Temple Authorities
│   ├── alerts.tsx                    # Live Safety & Weather Broadcasts Feed
│   ├── auth.tsx                      # Pilgrim & Authority Authentication / Role Selector
│   ├── destination-picker.tsx        # Multi-destination Switcher (Tirumala, Kashi, etc.)
│   ├── emergency.tsx                 # 1-Tap SOS Beacon & Emergency Hotline Directory
│   ├── family-hub.tsx                # Family GPS Tracking & Group Meeting Point Hub
│   ├── lodges.tsx                    # Dharamshalas, Accommodations & Amenities Directory
│   ├── place-map.tsx                 # Interactive Map with Facility Markers & Routing
│   ├── planner.tsx                   # Smart Day Darshan & Itinerary Planner
│   └── transport.tsx                 # Live Bus, Ghat Road & Transit Tracking
├── components/                       # Modular Design System & Glassmorphism UI
├── context/                          # YatraContext (State management, SOS, Alerts, Auth)
├── data/                             # Comprehensive Mock Data & Geo-coordinates
└── assets/                           # Branding, Icons, and Visual Assets
```

---

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
- **Routing:** [Expo Router v6](https://docs.expo.dev/router/introduction/) (File-based Typed Routing)
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/)
- **State Management & Querying:** [TanStack React Query v5](https://tanstack.com/query/latest) + React Context API + [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **AI Intelligence:** [Google Gemini AI API](https://ai.google.dev/) (with intelligent offline safety fallbacks)
- **UI & Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/), [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/), [Expo Vector Icons (Ionicons)](https://icons.expo.fyi/)
- **Styling:** Custom Glassmorphic Design System with dynamic Dark/Light theme support

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or 20+ recommended)
- [pnpm](https://pnpm.io/) or `npm`
- [Expo Go](https://expo.dev/client) app installed on your physical device (iOS/Android) or an Emulator.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vamsikrishnak7/YatraGuard-Pilgrimage-Safety-App.git
   cd YatraGuard-Pilgrimage-Safety-App
   ```

2. **Navigate to the app workspace & install dependencies:**
   ```bash
   cd YatraGuard-Pilgrimage-Safety-App
   pnpm install
   # or: npm install
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npx expo start
   # or: pnpm dev
   ```

5. **Open on Device:**
   - Scan the terminal QR code with the **Expo Go** app (Android) or **Camera** app (iOS).
   - Press `w` in terminal to launch in **Web Browser**.
   - Press `a` for **Android Emulator** or `i` for **iOS Simulator**.

---

## 🔐 Demo User Credentials

To test the application across different access levels:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👤 Pilgrim** | `pilgrim@yatraguard.in` | *(Any)* | Pilgrim Dashboard, Family Hub, SOS, AI Guide |
| **👮 Authority** | `admin@yatraguard.in` | *(Any)* | Command & Control Dashboard, Crowd & Gate Controls |

---

## 🔗 Useful Links & Repository Navigation

- **Core Application Directory:** [`/app`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app)
- **Authority Dashboard:** [`/app/authority/dashboard.tsx`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app/authority/dashboard.tsx)
- **Family Safety Hub:** [`/app/family-hub.tsx`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app/family-hub.tsx)
- **Emergency & SOS Dispatch:** [`/app/emergency.tsx`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app/emergency.tsx)
- **AI Darshan Assistant:** [`/app/(tabs)/ai.tsx`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app/(tabs)/ai.tsx)
- **Mock Data & Destination Telemetry:** [`/data/mockData.ts`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/data/mockData.ts)
- **App Configuration:** [`app.json`](file:///c:/Users/vamsi/Downloads/YatraGuard-Pilgrimage-Safety-App/YatraGuard-Pilgrimage-Safety-App/app.json)

---

## 🤝 Contributing

Contributions are warmly welcomed! If you wish to add new pilgrimage destinations, optimize routing algorithms, or enhance safety features:
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/AmazingSafetyFeature`).
3. Commit your changes (`git commit -m 'Add AmazingSafetyFeature'`).
4. Push to the branch (`git push origin feature/AmazingSafetyFeature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with devotion & care to safeguard every pilgrim's sacred journey. 🕉️🙏</sub>
</div>
