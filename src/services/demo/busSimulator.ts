import { BusLiveState, BusStop, TripEvent, TripPoint } from '../../types/trip';
import {
  DEMO_BUS_NO,
  DEMO_DRIVER_NAME,
  DEMO_ROUTE_PATH,
  DEMO_STOPS,
} from '../../constants/demoRoute';
import { ETA_FALLBACK_SPEED_KMH } from '../../constants/safety';
import { bearingDegrees, distanceMeters, interpolate } from '../../utils/geo';
import { TripMonitor } from '../../utils/tripMonitor';
import { createId } from '../../utils/id';

type StateListener = (state: BusLiveState) => void;
type EventListener = (event: TripEvent) => void;

const TICK_MS = 1000;
const TIME_LAPSE = 14;
/** Ticks the bus waits at each terminal between trips. */
const DWELL_TICKS = 40;

const ROUTE_OUT = DEMO_ROUTE_PATH;
const ROUTE_RET = [...DEMO_ROUTE_PATH].reverse();
const STOPS_OUT = DEMO_STOPS;
const STOPS_RET: BusStop[] = [...DEMO_STOPS].reverse();

/**
 * Self-contained demo bus for offline demo mode. Mirrors the server's demo
 * bus lifecycle: outbound trip → completed + dwell at the school → return
 * trip → dwell → repeat, with a scripted overspeed burst and long stop.
 */
class BusSimulator {
  private stateListeners = new Set<StateListener>();

  private eventListeners = new Set<EventListener>();

  private timer: ReturnType<typeof setInterval> | null = null;

  private monitor = new TripMonitor(DEMO_ROUTE_PATH);

  private outbound = true;

  private segment = 0;

  private progress = 0;

  private tick = 0;

  private pauseTicks = 0;

  private dwellTicks = 0;

  private boardingTicks = 0;

  private boardedStops = new Set<string>();

  private state: BusLiveState = this.buildInitialState();

  private recentEvents: TripEvent[] = [];

  private buildInitialState(): BusLiveState {
    return {
      busNo: DEMO_BUS_NO,
      tripId: createId('trip'),
      driverName: DEMO_DRIVER_NAME,
      status: 'active',
      location: ROUTE_OUT[0],
      heading: bearingDegrees(ROUTE_OUT[0], ROUTE_OUT[1]),
      speedKmh: 0,
      etaMinutes: 28,
      nextStop: STOPS_OUT[1].name,
      updatedAt: Date.now(),
    };
  }

  getSnapshot(): BusLiveState {
    return this.state;
  }

  getRecentEvents(): TripEvent[] {
    return [...this.recentEvents];
  }

  subscribe(onState: StateListener, onEvent?: EventListener): () => void {
    this.stateListeners.add(onState);
    if (onEvent) this.eventListeners.add(onEvent);
    onState(this.state);
    this.ensureRunning();
    return () => {
      this.stateListeners.delete(onState);
      if (onEvent) this.eventListeners.delete(onEvent);
      this.stopIfIdle();
    };
  }

  private ensureRunning(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.step(), TICK_MS);
  }

  /** Pause the interval when no screen is watching; resumes on subscribe. */
  private stopIfIdle(): void {
    if (this.stateListeners.size > 0 || this.eventListeners.size > 0) return;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private route(): typeof ROUTE_OUT {
    return this.outbound ? ROUTE_OUT : ROUTE_RET;
  }

  private stops(): BusStop[] {
    return this.outbound ? STOPS_OUT : STOPS_RET;
  }

  /** Scripted speed profile: cruising, one overspeed burst, one long stop. */
  private speedForTick(): number {
    if (this.pauseTicks > 0) return 0;
    if (this.tick >= 45 && this.tick <= 58) return 56 + Math.random() * 8;
    return 30 + Math.sin(this.tick / 7) * 8 + Math.random() * 4;
  }

  private step(): void {
    const route = this.route();
    const stops = this.stops();
    const terminal = stops[stops.length - 1].name;

    // Dwelling at a terminal between trips.
    if (this.dwellTicks > 0) {
      this.dwellTicks -= 1;
      this.state = {
        ...this.state,
        status: 'completed',
        location: route[route.length - 1],
        speedKmh: 0,
        etaMinutes: 0,
        nextStop: terminal,
        updatedAt: Date.now(),
      };
      if (this.dwellTicks === 0) {
        this.outbound = !this.outbound;
        this.segment = 0;
        this.progress = 0;
        this.tick = 0;
        this.boardedStops = new Set();
        this.monitor = new TripMonitor(DEMO_ROUTE_PATH);
        this.state = { ...this.state, tripId: createId('trip') };
        this.publishEvent({
          id: createId('evt'),
          type: 'trip_started',
          message: this.outbound
            ? 'Morning trip started from Lal Chowk'
            : 'Return trip started from the school',
          timestamp: Date.now(),
        });
      }
      this.stateListeners.forEach((listener) => listener(this.state));
      return;
    }

    // Briefly halted at a stop to board students.
    if (this.boardingTicks > 0) {
      this.boardingTicks -= 1;
      this.state = { ...this.state, speedKmh: 0, updatedAt: Date.now() };
      this.stateListeners.forEach((listener) => listener(this.state));
      return;
    }

    this.tick += 1;
    if (this.outbound && this.segment === 45 && this.pauseTicks === 0 && this.progress < 0.1) {
      this.pauseTicks = 100; // scripted long stop near Hawal
    }
    if (this.pauseTicks > 0) this.pauseTicks -= 1;

    const speedKmh = this.speedForTick();
    this.advance((speedKmh / 3.6) * (TICK_MS / 1000) * TIME_LAPSE);

    // Arrived at the terminal: complete the trip and dwell.
    if (this.segment >= route.length - 1) {
      this.dwellTicks = DWELL_TICKS;
      this.publishEvent({
        id: createId('evt'),
        type: 'trip_ended',
        message: `Trip completed at ${terminal}`,
        timestamp: Date.now(),
        location: route[route.length - 1],
      });
      return;
    }

    // Passing a pickup stop: halt for a few seconds to board students.
    const boardingStop = stops.find(
      (stop) =>
        stop.name !== terminal &&
        !this.boardedStops.has(stop.name) &&
        distanceMeters(
          interpolate(route[this.segment], route[Math.min(this.segment + 1, route.length - 1)], this.progress),
          stop.location
        ) < 120
    );
    if (boardingStop) {
      this.boardedStops.add(boardingStop.name);
      this.boardingTicks = 7;
    }

    const next = Math.min(this.segment + 1, route.length - 1);
    const location = interpolate(route[this.segment], route[next], this.progress);

    let remainingM = distanceMeters(location, route[next]);
    for (let i = next; i < route.length - 1; i += 1) {
      remainingM += distanceMeters(route[i], route[i + 1]);
    }
    const nextStopEntry = stops.find(
      (stop) => distanceMeters(location, stop.location) < remainingM
    );
    const etaSpeed = Math.max(speedKmh, ETA_FALLBACK_SPEED_KMH) * TIME_LAPSE;

    this.state = {
      ...this.state,
      location,
      speedKmh,
      heading: bearingDegrees(route[this.segment], route[next]),
      etaMinutes: Math.max(1, Math.round(remainingM / 1000 / (etaSpeed / 60))),
      nextStop: nextStopEntry?.name ?? terminal,
      status: 'active',
      updatedAt: Date.now(),
    };

    const point: TripPoint = { ...location, timestamp: Date.now(), speedKmh };
    this.monitor.addPoint(point).forEach((event) => this.publishEvent(event));

    this.stateListeners.forEach((listener) => listener(this.state));
  }

  private advance(meters: number): void {
    const route = this.route();
    let remaining = meters;
    while (remaining > 0 && this.segment < route.length - 1) {
      const from = route[this.segment];
      const to = route[this.segment + 1];
      const segmentLength = distanceMeters(from, to);
      const left = segmentLength * (1 - this.progress);
      if (remaining < left) {
        this.progress += remaining / segmentLength;
        remaining = 0;
      } else {
        remaining -= left;
        this.segment += 1;
        this.progress = 0;
      }
    }
  }

  private publishEvent(event: TripEvent): void {
    this.recentEvents = [event, ...this.recentEvents].slice(0, 20);
    this.eventListeners.forEach((listener) => listener(event));
  }
}

export const busSimulator = new BusSimulator();
