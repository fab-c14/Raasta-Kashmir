// Server-side demo bus: drives the Srinagar route so parent/school/RTO
// dashboards are live the moment the server is up — no driver phone needed.
// It yields automatically whenever a real driver publishes for the same bus.

import { ROUTE_POINTS, STOP_INDICES } from './routeData.js';

const BUS_NO = 'JK-01-A-1234';
const DRIVER = 'Jehangir Dar';
// Real road-following polyline shared with the app (see routeData.js).
const ROUTE = ROUTE_POINTS;
const STOPS = STOP_INDICES.map((stop) => ({ name: stop.name, i: stop.index }));
const TIME_LAPSE = 14;

const toRad = (d) => (d * Math.PI) / 180;
const distM = (a, b) => {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
};
const lerp = (a, b, t) => ({
  latitude: a.latitude + (b.latitude - a.latitude) * t,
  longitude: a.longitude + (b.longitude - a.longitude) * t,
});
const bearing = (a, b) => {
  const y = Math.sin(toRad(b.longitude - a.longitude)) * Math.cos(toRad(b.latitude));
  const x = Math.cos(toRad(a.latitude)) * Math.sin(toRad(b.latitude)) -
    Math.sin(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.cos(toRad(b.longitude - a.longitude));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

export function startDemoBus(io, store) {
  let segment = 0;
  let progress = 0;
  let tick = 0;
  let pauseTicks = 0;
  let tripId = `trip_${Date.now().toString(36)}`;
  let lastOverspeedAt = 0;
  let longStopReported = false;

  const emitEvent = (type, message, location, speedKmh) => {
    const event = {
      id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      message,
      timestamp: Date.now(),
      location,
      speedKmh,
      busNo: BUS_NO,
    };
    io.to(`bus:${BUS_NO}`).emit('bus:event', event);
  };

  setInterval(() => {
    // Yield to a real driver phone publishing for this bus.
    const current = store.liveBuses.get(BUS_NO);
    if (current && !current.isDemo && Date.now() - current.updatedAt < 8000) return;

    tick += 1;
    if (segment === 45 && pauseTicks === 0 && progress < 0.1) pauseTicks = 100;
    if (pauseTicks > 0) pauseTicks -= 1;

    const speedKmh = pauseTicks > 0
      ? 0
      : tick >= 45 && tick <= 58
        ? 56 + Math.random() * 8
        : 30 + Math.sin(tick / 7) * 8 + Math.random() * 4;

    let meters = (speedKmh / 3.6) * TIME_LAPSE;
    while (meters > 0 && segment < ROUTE.length - 1) {
      const len = distM(ROUTE[segment], ROUTE[segment + 1]);
      const left = len * (1 - progress);
      if (meters < left) {
        progress += meters / len;
        meters = 0;
      } else {
        meters -= left;
        segment += 1;
        progress = 0;
      }
    }
    if (segment >= ROUTE.length - 1) {
      segment = 0;
      progress = 0;
      tick = 0;
      longStopReported = false;
      tripId = `trip_${Date.now().toString(36)}`;
    }

    const next = Math.min(segment + 1, ROUTE.length - 1);
    const location = lerp(ROUTE[segment], ROUTE[next], progress);
    let remaining = distM(location, ROUTE[next]);
    for (let i = next; i < ROUTE.length - 1; i += 1) remaining += distM(ROUTE[i], ROUTE[i + 1]);
    const nextStop = (STOPS.find((s) => s.i > segment) ?? STOPS.at(-1)).name;
    const etaSpeed = Math.max(speedKmh, 24) * TIME_LAPSE;

    const state = {
      busNo: BUS_NO,
      tripId,
      driverName: DRIVER,
      status: 'active',
      location,
      heading: bearing(ROUTE[segment], ROUTE[next]),
      speedKmh,
      etaMinutes: Math.max(1, Math.round(remaining / 1000 / (etaSpeed / 60))),
      nextStop,
      updatedAt: Date.now(),
      isDemo: true,
    };
    store.liveBuses.set(BUS_NO, state);
    io.to(`bus:${BUS_NO}`).emit('bus:state', state);

    if (speedKmh > 50 && Date.now() - lastOverspeedAt > 30000) {
      lastOverspeedAt = Date.now();
      emitEvent('overspeed', `Overspeeding detected: ${Math.round(speedKmh)} km/h in a 50 km/h zone`, location, speedKmh);
    }
    if (pauseTicks > 0 && pauseTicks < 10 && !longStopReported) {
      longStopReported = true;
      emitEvent('long_stop', 'Unscheduled stop for 2+ minutes near Hawal', location, 0);
    }
  }, 1000);

  console.log(`  Demo bus ${BUS_NO} driving the Srinagar route (yields to real drivers)`);
}
