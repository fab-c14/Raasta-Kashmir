import { BusLiveState, TripEvent, TripPoint } from '../../types/trip';
import {
  DEMO_BUS_NO,
  DEMO_DRIVER_NAME,
  DEMO_ROUTE_PATH,
  DEMO_STOPS,
} from '../../constants/demoRoute';
import { ETA_FALLBACK_SPEED_KMH } from '../../constants/safety';
import {
  bearingDegrees,
  distanceMeters,
  interpolate,
  remainingPathMeters,
} from '../../utils/geo';
import { TripMonitor } from '../../utils/tripMonitor';
import { createId } from '../../utils/id';

type StateListener = (state: BusLiveState) => void;
type EventListener = (event: TripEvent) => void;

const TICK_MS = 1000;

/**
 * Self-contained demo bus. When no backend URL is configured, this simulator
 * drives the demo route in real time — including a scripted overspeed burst
 * and a long stop — so parent/school/RTO dashboards are fully live without
 * any keys, hardware or server.
 */
class BusSimulator {
  private stateListeners = new Set<StateListener>();

  private eventListeners = new Set<EventListener>();

  private timer: ReturnType<typeof setInterval> | null = null;

  private monitor = new TripMonitor(DEMO_ROUTE_PATH);

  private segment = 0;

  private progress = 0;

  private tick = 0;

  private pauseTicks = 0;

  private state: BusLiveState = this.buildInitialState();

  private recentEvents: TripEvent[] = [];

  private buildInitialState(): BusLiveState {
    return {
      busNo: DEMO_BUS_NO,
      tripId: createId('trip'),
      driverName: DEMO_DRIVER_NAME,
      status: 'active',
      location: DEMO_ROUTE_PATH[0],
      heading: bearingDegrees(DEMO_ROUTE_PATH[0], DEMO_ROUTE_PATH[1]),
      speedKmh: 0,
      etaMinutes: 28,
      nextStop: DEMO_STOPS[1].name,
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

  /** Scripted speed profile: cruising, one overspeed burst, one long stop. */
  private speedForTick(): number {
    if (this.pauseTicks > 0) return 0;
    if (this.tick >= 45 && this.tick <= 58) return 56 + Math.random() * 8;
    return 30 + Math.sin(this.tick / 7) * 8 + Math.random() * 4;
  }

  private step(): void {
    this.tick += 1;

    if (this.segment === 7 && this.pauseTicks === 0 && this.progress < 0.1) {
      this.pauseTicks = 100; // scripted long stop near Nishat
    }
    if (this.pauseTicks > 0) this.pauseTicks -= 1;

    const speedKmh = this.speedForTick();
    const metersThisTick = (speedKmh / 3.6) * (TICK_MS / 1000) * 14; // 14x time-lapse
    this.advance(metersThisTick);

    const location = interpolate(
      DEMO_ROUTE_PATH[this.segment],
      DEMO_ROUTE_PATH[Math.min(this.segment + 1, DEMO_ROUTE_PATH.length - 1)],
      this.progress
    );

    const remainingM = remainingPathMeters(location, DEMO_ROUTE_PATH);
    const etaSpeed = Math.max(speedKmh, ETA_FALLBACK_SPEED_KMH) * 14;
    const nextStop =
      DEMO_STOPS.find(
        (stop) => distanceMeters(location, stop.location) < remainingM
      )?.name ?? DEMO_STOPS[DEMO_STOPS.length - 1].name;

    this.state = {
      ...this.state,
      location,
      speedKmh,
      heading: bearingDegrees(
        DEMO_ROUTE_PATH[this.segment],
        DEMO_ROUTE_PATH[Math.min(this.segment + 1, DEMO_ROUTE_PATH.length - 1)]
      ),
      etaMinutes: Math.max(1, Math.round(remainingM / 1000 / (etaSpeed / 60))),
      nextStop,
      status: 'active',
      updatedAt: Date.now(),
    };

    const point: TripPoint = { ...location, timestamp: Date.now(), speedKmh };
    this.monitor.addPoint(point).forEach((event) => this.publishEvent(event));

    this.stateListeners.forEach((listener) => listener(this.state));
  }

  private advance(meters: number): void {
    let remaining = meters;
    while (remaining > 0 && this.segment < DEMO_ROUTE_PATH.length - 1) {
      const from = DEMO_ROUTE_PATH[this.segment];
      const to = DEMO_ROUTE_PATH[this.segment + 1];
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
    if (this.segment >= DEMO_ROUTE_PATH.length - 1) {
      this.segment = 0;
      this.progress = 0;
      this.tick = 0;
      this.monitor = new TripMonitor(DEMO_ROUTE_PATH);
      this.state = { ...this.state, tripId: createId('trip') };
    }
  }

  private publishEvent(event: TripEvent): void {
    this.recentEvents = [event, ...this.recentEvents].slice(0, 20);
    this.eventListeners.forEach((listener) => listener(event));
  }
}

export const busSimulator = new BusSimulator();
