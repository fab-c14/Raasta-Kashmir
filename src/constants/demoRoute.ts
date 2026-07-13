import { BusStop, LatLng } from '../types/trip';

export const DEMO_BUS_NO = 'JK-01-A-1234';
export const DEMO_ROUTE_NAME = 'Lal Chowk → Kashmir Valley School';
export const DEMO_DRIVER_NAME = 'Jehangir Dar';

/**
 * Morning pickup route through Srinagar: Lal Chowk → Dalgate → Boulevard
 * Road along Dal Lake → Nishat → Hazratbal (school).
 */
export const DEMO_ROUTE_PATH: LatLng[] = [
  { latitude: 34.0722, longitude: 74.8091 },
  { latitude: 34.0741, longitude: 74.8153 },
  { latitude: 34.0748, longitude: 74.8216 },
  { latitude: 34.0779, longitude: 74.8298 },
  { latitude: 34.0827, longitude: 74.8364 },
  { latitude: 34.0882, longitude: 74.8422 },
  { latitude: 34.0944, longitude: 74.8489 },
  { latitude: 34.1013, longitude: 74.8551 },
  { latitude: 34.1088, longitude: 74.8604 },
  { latitude: 34.1159, longitude: 74.8586 },
  { latitude: 34.1221, longitude: 74.8524 },
  { latitude: 34.1273, longitude: 74.8455 },
  { latitude: 34.1301, longitude: 74.8399 },
  { latitude: 34.1318, longitude: 74.8367 },
];

export const DEMO_STOPS: BusStop[] = [
  { name: 'Lal Chowk', location: DEMO_ROUTE_PATH[0] },
  { name: 'Dalgate', location: DEMO_ROUTE_PATH[2] },
  { name: 'Boulevard Road', location: DEMO_ROUTE_PATH[5] },
  { name: 'Nishat Bagh', location: DEMO_ROUTE_PATH[8] },
  { name: 'Naseem Bagh', location: DEMO_ROUTE_PATH[11] },
  { name: 'Kashmir Valley School', location: DEMO_ROUTE_PATH[13] },
];

export const DEMO_REGION = {
  latitude: 34.102,
  longitude: 74.838,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};
