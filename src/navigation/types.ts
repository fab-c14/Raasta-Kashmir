import { UserRole } from '../types/auth';
import { Trip } from '../types/trip';

export type AuthStackParamList = {
  Login: undefined;
  Signup: { defaultRole?: UserRole } | undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  TripSummary: { trip: Trip };
  TripDetail: { trip: Trip };
  ReportComplaint: undefined;
  FullMap: { busNo: string; pickupStopName?: string };
};

export type DriverTabParamList = {
  DriverHome: undefined;
  TripHistory: undefined;
  Profile: undefined;
};

export type ParentTabParamList = {
  ParentHome: undefined;
  Alerts: undefined;
  Profile: undefined;
};

export type SchoolTabParamList = {
  SchoolHome: undefined;
  Complaints: undefined;
  Rankings: undefined;
  Profile: undefined;
};

export type RtoTabParamList = {
  RtoHome: undefined;
  Violations: undefined;
  Profile: undefined;
};
