/**
 * Shared Type Definitions
 */

export interface User {
  id: string;
  name: string;
  role: 'driver' | 'parent' | 'school_admin';
  phone?: string;
  email: string;
}

export interface Route {
  id: string;
  name: string;
  driverId: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface Stop {
  id: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  estimatedTime?: Date;
  status: 'pending' | 'arrived' | 'departed';
}
