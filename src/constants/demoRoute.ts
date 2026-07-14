import { BusStop, LatLng } from '../types/trip';
import { ROUTE_POINTS, STOP_INDICES } from './routeData';

export const DEMO_BUS_NO = 'JK-01-A-1234';
export const DEMO_ROUTE_NAME = 'Lal Chowk → Kashmir Valley School';
export const DEMO_DRIVER_NAME = 'Jehangir Dar';

/**
 * Morning pickup route through Srinagar's old city to Hazratbal. The
 * polyline comes from real OSRM driving directions (see routeData.ts), so
 * it follows actual roads and never crosses the lake.
 */
export const DEMO_ROUTE_PATH: LatLng[] = ROUTE_POINTS;

export const DEMO_STOPS: BusStop[] = STOP_INDICES.map((stop) => ({
  name: stop.name,
  location: ROUTE_POINTS[stop.index],
}));

export const DEMO_REGION = {
  latitude: 34.101,
  longitude: 74.8265,
  latitudeDelta: 0.075,
  longitudeDelta: 0.075,
};
