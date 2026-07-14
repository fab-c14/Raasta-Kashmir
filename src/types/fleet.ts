import { TripStatus } from './trip';
import { ComplaintAnalysis, RiskLevel } from './ai';

export interface FleetBus {
  busNo: string;
  driverName: string;
  routeName: string;
  status: TripStatus;
  studentsOnBoard: number;
  safetyScore: number;
}

export interface DriverRanking {
  driverId: string;
  driverName: string;
  busNo: string;
  safetyScore: number;
  tripsCompleted: number;
  violations: number;
  trend: 'up' | 'down' | 'flat';
}

export interface Student {
  id: string;
  name: string;
  className: string;
  busNo: string;
  parentName?: string;
  /** Stop where this student boards the bus. */
  pickupStop?: string;
}

export type ComplaintStatus = 'open' | 'reviewing' | 'resolved';

export interface Complaint {
  id: string;
  busNo: string;
  parentName: string;
  text: string;
  createdAt: number;
  status: ComplaintStatus;
  analysis?: ComplaintAnalysis;
}

export interface ComplianceRecord {
  busNo: string;
  schoolName: string;
  routeName: string;
  insuranceValidTill: string;
  lastInspection: string;
  isCompliant: boolean;
}

export interface ViolationRecord {
  id: string;
  busNo: string;
  driverName: string;
  type: string;
  detail: string;
  date: string;
  severity: RiskLevel;
}

export interface AnalyticsSummary {
  totalTripsToday: number;
  activeTrips: number;
  totalViolationsWeek: number;
  avgFleetSafetyScore: number;
  complianceRate: number;
  sosCountMonth: number;
}
