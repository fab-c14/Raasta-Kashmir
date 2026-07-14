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
export const DEMO_ROUTE_PATH_A: LatLng[] = ROUTE_POINTS;

// Create Route B by applying an offset to the middle coordinates to simulate a detour (deviation)
export const DEMO_ROUTE_PATH_B: LatLng[] = ROUTE_POINTS.map((pt, idx) => {
  if (idx >= 25 && idx <= 90) {
    return {
      latitude: pt.latitude + 0.008,
      longitude: pt.longitude + 0.008,
    };
  }
  return pt;
});

export const DEMO_ROUTE_PATH: LatLng[] = DEMO_ROUTE_PATH_A;

export const DEMO_STOPS: BusStop[] = STOP_INDICES.map((stop) => ({
  name: stop.name,
  location: ROUTE_POINTS[stop.index],
}));

export const SCHOOL_LOCATION: LatLng = DEMO_ROUTE_PATH_A[DEMO_ROUTE_PATH_A.length - 1];

export const DEMO_REGION = {
  latitude: 34.101,
  longitude: 74.8265,
  latitudeDelta: 0.075,
  longitudeDelta: 0.075,
};

