import { UserRole } from '../types/auth';

export type AuthStackParamList = {
  Login: undefined;
  Signup: { defaultRole?: UserRole } | undefined;
};

export type AppStackParamList = {
  DriverDashboard: undefined;
  ParentDashboard: undefined;
  SchoolDashboard: undefined;
  RTODashboard: undefined;
};
