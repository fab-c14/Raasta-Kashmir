import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { isLiveBackend } from '../config/env';
import { Trip } from '../types/trip';
import {
  AnalyticsSummary,
  Complaint,
  ComplianceRecord,
  DriverRanking,
  FleetBus,
  ViolationRecord,
} from '../types/fleet';
import {
  buildDemoHistory,
  demoAnalytics,
  demoComplaints,
  demoCompliance,
  demoFleet,
  demoRankings,
  demoViolations,
} from './demo/demoData';
import { createId } from '../utils/id';

const HISTORY_KEY = '@raasta_trip_history';
const COMPLAINTS_KEY = '@raasta_complaints';

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Try the live backend first; if it is unreachable (wrong IP, server down,
 * phone off Wi-Fi) fall back to demo data so no screen is ever stuck on a
 * skeleton. Demo mode skips the network entirely.
 */
const liveOrDemo = async <T>(live: () => Promise<T>, demo: () => Promise<T>): Promise<T> => {
  if (!isLiveBackend) return demo();
  try {
    return await live();
  } catch {
    return demo();
  }
};

const saveLocalTrip = async (trip: Trip): Promise<void> => {
  const stored = await readJson<Trip[]>(HISTORY_KEY, []);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([trip, ...stored].slice(0, 50)));
};

export const tripService = {
  /** Persist a finished trip (backend when live, AsyncStorage as fallback). */
  async saveTrip(trip: Trip): Promise<void> {
    await liveOrDemo(
      async () => {
        await apiClient.post('/api/trips', trip);
      },
      () => saveLocalTrip(trip)
    );
  },

  async getTripHistory(driverId: string, driverName: string, busNo: string): Promise<Trip[]> {
    const demo = async (): Promise<Trip[]> => {
      const stored = await readJson<Trip[]>(HISTORY_KEY, []);
      return [...stored, ...buildDemoHistory(driverId, driverName, busNo)];
    };
    return liveOrDemo(async () => {
      const { data } = await apiClient.get<Trip[]>('/api/trips', { params: { busNo } });
      return data.length > 0 ? data : demo();
    }, demo);
  },

  async getFleet(): Promise<FleetBus[]> {
    return liveOrDemo(
      async () => (await apiClient.get<FleetBus[]>('/api/fleet')).data,
      async () => demoFleet
    );
  },

  async getRankings(): Promise<DriverRanking[]> {
    return liveOrDemo(
      async () => (await apiClient.get<DriverRanking[]>('/api/rankings')).data,
      async () => demoRankings
    );
  },

  async getComplaints(): Promise<Complaint[]> {
    const demo = async (): Promise<Complaint[]> => {
      const stored = await readJson<Complaint[]>(COMPLAINTS_KEY, []);
      return [...stored, ...demoComplaints];
    };
    return liveOrDemo(async () => {
      const { data } = await apiClient.get<Complaint[]>('/api/complaints');
      return data.length > 0 ? data : demo();
    }, demo);
  },

  async submitComplaint(busNo: string, parentName: string, text: string): Promise<Complaint> {
    const complaint: Complaint = {
      id: createId('cmp'),
      busNo,
      parentName,
      text,
      createdAt: Date.now(),
      status: 'open',
    };
    return liveOrDemo(
      async () =>
        (await apiClient.post<Complaint>('/api/complaints', { busNo, parentName, text })).data,
      async () => {
        const stored = await readJson<Complaint[]>(COMPLAINTS_KEY, []);
        await AsyncStorage.setItem(COMPLAINTS_KEY, JSON.stringify([complaint, ...stored]));
        return complaint;
      }
    );
  },

  async getCompliance(): Promise<ComplianceRecord[]> {
    return liveOrDemo(
      async () => (await apiClient.get<ComplianceRecord[]>('/api/compliance')).data,
      async () => demoCompliance
    );
  },

  async getViolations(): Promise<ViolationRecord[]> {
    return liveOrDemo(
      async () => (await apiClient.get<ViolationRecord[]>('/api/violations')).data,
      async () => demoViolations
    );
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    return liveOrDemo(
      async () => (await apiClient.get<AnalyticsSummary>('/api/analytics')).data,
      async () => demoAnalytics
    );
  },
};
