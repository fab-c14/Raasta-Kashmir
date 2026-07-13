import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Trip, TripEvent, TripPoint } from '../types/trip';
import { UserProfile } from '../types/auth';
import { DEMO_ROUTE_NAME, DEMO_ROUTE_PATH, DEMO_STOPS } from '../constants/demoRoute';
import { TripMonitor, computeSafetyScore } from '../utils/tripMonitor';
import {
  bearingDegrees,
  distanceMeters,
  distanceToPathMeters,
  remainingPathMeters,
} from '../utils/geo';
import { createId } from '../utils/id';
import { locationService } from '../services/locationService';
import { startDriveSimulation } from '../services/demo/driveSimulator';
import { realtimeService } from '../services/realtime';
import { tripService } from '../services/tripService';
import { ETA_FALLBACK_SPEED_KMH } from '../constants/safety';

interface TripContextType {
  trip: Trip | null;
  lastPoint: TripPoint | null;
  liveScore: number;
  isSimulatedGps: boolean;
  startTrip: (profile: UserProfile) => Promise<void>;
  endTrip: () => Promise<Trip | null>;
  triggerSos: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [lastPoint, setLastPoint] = useState<TripPoint | null>(null);
  const [liveScore, setLiveScore] = useState(100);
  const [isSimulatedGps, setIsSimulatedGps] = useState(false);

  const tripRef = useRef<Trip | null>(null);
  const monitorRef = useRef<TripMonitor | null>(null);
  const offDemoRouteRef = useRef(false);
  const stopWatchingRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopWatchingRef.current?.(), []);

  const pushEvent = useCallback((event: TripEvent): void => {
    const current = tripRef.current;
    if (!current) return;
    const events = [...current.events, event];
    const updated: Trip = { ...current, events, safetyScore: computeSafetyScore(events) };
    tripRef.current = updated;
    setTrip(updated);
    setLiveScore(updated.safetyScore);
    realtimeService.publishEvent(updated.busNo, event);
  }, []);

  const handlePoint = useCallback(
    (point: TripPoint): void => {
      const current = tripRef.current;
      if (!current || current.status !== 'active') return;

      // Assign the planned route on the first fix. When the driver is
      // testing far from the Srinagar demo route, route-deviation checks
      // are disabled — comparing real GPS to a route the bus was never on
      // would flag nonsense deviations.
      if (!monitorRef.current) {
        offDemoRouteRef.current = distanceToPathMeters(point, DEMO_ROUTE_PATH) > 2000;
        monitorRef.current = new TripMonitor(offDemoRouteRef.current ? [] : DEMO_ROUTE_PATH);
      }

      const previous = current.path[current.path.length - 1];
      const addedKm = previous ? distanceMeters(previous, point) / 1000 : 0;
      const updated: Trip = {
        ...current,
        path: [...current.path, point],
        distanceKm: current.distanceKm + addedKm,
        maxSpeedKmh: Math.max(current.maxSpeedKmh, point.speedKmh),
      };
      const elapsedH = (point.timestamp - updated.startedAt) / 3_600_000;
      updated.avgSpeedKmh = elapsedH > 0 ? Math.min(updated.distanceKm / elapsedH, 80) : 0;
      tripRef.current = updated;
      setTrip(updated);
      setLastPoint(point);

      monitorRef.current?.addPoint(point).forEach(pushEvent);

      const remainingM = remainingPathMeters(point, DEMO_ROUTE_PATH);
      const etaSpeed = Math.max(point.speedKmh, ETA_FALLBACK_SPEED_KMH);
      const offRoute = offDemoRouteRef.current;
      realtimeService.publishDriverState({
        busNo: updated.busNo,
        tripId: updated.id,
        driverName: updated.driverName,
        status: updated.status,
        location: { latitude: point.latitude, longitude: point.longitude },
        heading: previous ? bearingDegrees(previous, point) : 0,
        speedKmh: point.speedKmh,
        etaMinutes: offRoute
          ? 0
          : Math.max(1, Math.min(999, Math.round(remainingM / 1000 / (etaSpeed / 60)))),
        nextStop: offRoute
          ? 'En route'
          : DEMO_STOPS.find((stop) => distanceMeters(point, stop.location) < remainingM)?.name ??
            DEMO_STOPS[DEMO_STOPS.length - 1].name,
        updatedAt: point.timestamp,
      });
    },
    [pushEvent]
  );

  const startTrip = useCallback(
    async (profile: UserProfile): Promise<void> => {
      const startedAt = Date.now();
      const newTrip: Trip = {
        id: createId('trip'),
        busNo: profile.vehicleNo ?? 'JK-01-A-1234',
        driverId: profile.uid,
        driverName: profile.name,
        routeName: DEMO_ROUTE_NAME,
        status: 'active',
        startedAt,
        distanceKm: 0,
        maxSpeedKmh: 0,
        avgSpeedKmh: 0,
        safetyScore: 100,
        events: [
          {
            id: createId('evt'),
            type: 'trip_started',
            message: 'Trip started',
            timestamp: startedAt,
          },
        ],
        path: [],
      };
      tripRef.current = newTrip;
      monitorRef.current = null; // created on the first GPS fix
      offDemoRouteRef.current = false;
      setTrip(newTrip);
      setLiveScore(100);

      const hasPermission = await locationService.requestPermission();
      if (hasPermission) {
        setIsSimulatedGps(false);
        stopWatchingRef.current = await locationService.watchPosition(handlePoint);
      } else {
        setIsSimulatedGps(true);
        stopWatchingRef.current = startDriveSimulation(handlePoint);
      }
    },
    [handlePoint]
  );

  const endTrip = useCallback(async (): Promise<Trip | null> => {
    stopWatchingRef.current?.();
    stopWatchingRef.current = null;
    const current = tripRef.current;
    if (!current) return null;
    const endedAt = Date.now();
    const finished: Trip = {
      ...current,
      status: 'completed',
      endedAt,
      events: [
        ...current.events,
        { id: createId('evt'), type: 'trip_ended', message: 'Trip ended', timestamp: endedAt },
      ],
    };
    tripRef.current = null;
    setTrip(null);
    setLastPoint(null);
    try {
      await tripService.saveTrip(finished);
    } catch {
      // History persistence must never block ending a trip.
    }
    return finished;
  }, []);

  const triggerSos = useCallback((): void => {
    const current = tripRef.current;
    if (!current) return;
    const point = current.path[current.path.length - 1];
    pushEvent({
      id: createId('evt'),
      type: 'sos',
      message: 'EMERGENCY SOS raised by driver',
      timestamp: Date.now(),
      location: point ? { latitude: point.latitude, longitude: point.longitude } : undefined,
    });
    const updated: Trip = { ...tripRef.current!, status: 'sos' };
    tripRef.current = updated;
    setTrip(updated);
  }, [pushEvent]);

  return (
    <TripContext.Provider
      value={{ trip, lastPoint, liveScore, isSimulatedGps, startTrip, endTrip, triggerSos }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) throw new Error('useTrip must be used within a TripProvider');
  return context;
};
