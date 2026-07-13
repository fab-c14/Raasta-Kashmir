import { BusStop, LatLng } from '../types/trip';

export const DEMO_BUS_NO = 'JK-01-A-1234';
export const DEMO_ROUTE_NAME = 'Lal Chowk → Kashmir Valley School';
export const DEMO_DRIVER_NAME = 'Jehangir Dar';

/**
 * Morning pickup route through Srinagar's old city, following the road
 * corridor west of Dal Lake so the polyline stays on land:
 * Lal Chowk → Nowhatta → Khanyar → Hawal → Naseem Bagh → Hazratbal.
 */
export const DEMO_ROUTE_PATH: LatLng[] = [
  { latitude: 34.0715, longitude: 74.809 },
  { latitude: 34.0762, longitude: 74.8104 },
  { latitude: 34.0815, longitude: 74.8121 },
  { latitude: 34.0866, longitude: 74.8131 },
  { latitude: 34.092, longitude: 74.8168 },
  { latitude: 34.0968, longitude: 74.8202 },
  { latitude: 34.1023, longitude: 74.8244 },
  { latitude: 34.108, longitude: 74.8288 },
  { latitude: 34.1136, longitude: 74.8318 },
  { latitude: 34.1192, longitude: 74.8345 },
  { latitude: 34.1246, longitude: 74.8377 },
  { latitude: 34.1284, longitude: 74.841 },
  { latitude: 34.13, longitude: 74.8432 },
];

export const DEMO_STOPS: BusStop[] = [
  { name: 'Lal Chowk', location: DEMO_ROUTE_PATH[0] },
  { name: 'Nowhatta', location: DEMO_ROUTE_PATH[3] },
  { name: 'Khanyar', location: DEMO_ROUTE_PATH[4] },
  { name: 'Hawal', location: DEMO_ROUTE_PATH[5] },
  { name: 'Naseem Bagh', location: DEMO_ROUTE_PATH[10] },
  { name: 'Kashmir Valley School', location: DEMO_ROUTE_PATH[12] },
];

export const DEMO_REGION = {
  latitude: 34.101,
  longitude: 74.8265,
  latitudeDelta: 0.075,
  longitudeDelta: 0.075,
};
