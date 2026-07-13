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

export const tripService = {
  /** Persist a finished trip (backend when live, AsyncStorage in demo). */
  async saveTrip(trip: Trip): Promise<void> {
    if (isLiveBackend) {
      await apiClient.post('/api/trips', trip);
      return;
    }
    const stored = await readJson<Trip[]>(HISTORY_KEY, []);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([trip, ...stored].slice(0, 50)));
  },

  async getTripHistory(driverId: string, driverName: string, busNo: string): Promise<Trip[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<Trip[]>('/api/trips', { params: { busNo } });
      return data;
    }
    const stored = await readJson<Trip[]>(HISTORY_KEY, []);
    return [...stored, ...buildDemoHistory(driverId, driverName, busNo)];
  },

  async getFleet(): Promise<FleetBus[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<FleetBus[]>('/api/fleet');
      return data;
    }
    return demoFleet;
  },

  async getRankings(): Promise<DriverRanking[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<DriverRanking[]>('/api/rankings');
      return data;
    }
    return demoRankings;
  },

  async getComplaints(): Promise<Complaint[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<Complaint[]>('/api/complaints');
      return data;
    }
    const stored = await readJson<Complaint[]>(COMPLAINTS_KEY, []);
    return [...stored, ...demoComplaints];
  },

  async submitComplaint(busNo: string, parentName: string, text: string): Promise<Complaint> {
    if (isLiveBackend) {
      const { data } = await apiClient.post<Complaint>('/api/complaints', {
        busNo,
        parentName,
        text,
      });
      return data;
    }
    const complaint: Complaint = {
      id: createId('cmp'),
      busNo,
      parentName,
      text,
      createdAt: Date.now(),
      status: 'open',
    };
    const stored = await readJson<Complaint[]>(COMPLAINTS_KEY, []);
    await AsyncStorage.setItem(COMPLAINTS_KEY, JSON.stringify([complaint, ...stored]));
    return complaint;
  },

  async getCompliance(): Promise<ComplianceRecord[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<ComplianceRecord[]>('/api/compliance');
      return data;
    }
    return demoCompliance;
  },

  async getViolations(): Promise<ViolationRecord[]> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<ViolationRecord[]>('/api/violations');
      return data;
    }
    return demoViolations;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    if (isLiveBackend) {
      const { data } = await apiClient.get<AnalyticsSummary>('/api/analytics');
      return data;
    }
    return demoAnalytics;
  },
};
