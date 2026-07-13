import mongoose from 'mongoose';
import * as seed from './seed.js';

// `id` must be an explicit path: Mongoose's built-in `id` virtual otherwise
// swallows the field on create and documents come back without it.
const tripSchema = new mongoose.Schema(
  { id: String },
  { strict: false, collection: 'trips', id: false }
);
const complaintSchema = new mongoose.Schema(
  { id: String },
  { strict: false, collection: 'complaints', id: false }
);

/**
 * Data layer with two backends: MongoDB (when MONGODB_URI is set and
 * reachable) or an in-memory fallback so the server always boots.
 */
export async function connectStore(mongoUri) {
  let usingMongo = false;
  let TripModel = null;
  let ComplaintModel = null;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });
      TripModel = mongoose.model('Trip', tripSchema);
      ComplaintModel = mongoose.model('Complaint', complaintSchema);
      usingMongo = true;
    } catch (error) {
      console.warn('MongoDB unreachable, falling back to in-memory store:', error.message);
    }
  }

  const memory = { trips: [], complaints: [] };
  // Live bus state kept in memory in both modes (ephemeral realtime data).
  const liveBuses = new Map();

  return {
    usingMongo,
    liveBuses,

    async saveTrip(trip) {
      if (usingMongo) {
        await TripModel.create(trip);
        return trip;
      }
      memory.trips.unshift(trip);
      memory.trips = memory.trips.slice(0, 500);
      return trip;
    },

    async getTrips(busNo) {
      if (usingMongo) {
        const query = busNo ? { busNo } : {};
        return TripModel.find(query).sort({ startedAt: -1 }).limit(50).lean();
      }
      return memory.trips.filter((trip) => !busNo || trip.busNo === busNo);
    },

    async saveComplaint(complaint) {
      if (usingMongo) {
        await ComplaintModel.create(complaint);
        return complaint;
      }
      memory.complaints.unshift(complaint);
      return complaint;
    },

    async getComplaints() {
      if (usingMongo) {
        return ComplaintModel.find({}).sort({ createdAt: -1 }).limit(100).lean();
      }
      return memory.complaints;
    },

    async updateComplaintStatus(id, status) {
      if (usingMongo) {
        await ComplaintModel.updateOne({ id }, { $set: { status } });
        return ComplaintModel.findOne({ id }).lean();
      }
      const complaint = memory.complaints.find((item) => item.id === id);
      if (complaint) complaint.status = status;
      return complaint ?? null;
    },

    getFleet() {
      return seed.fleet.map((bus) => {
        const live = liveBuses.get(bus.busNo);
        return live ? { ...bus, status: live.status } : bus;
      });
    },

    getRankings: () => seed.rankings,
    getCompliance: () => seed.compliance,
    getViolations: () => seed.violations,

    async getAnalytics() {
      const trips = await this.getTrips();
      const active = [...liveBuses.values()].filter(
        (bus) => bus.status === 'active' || bus.status === 'sos'
      );
      const weekAgo = Date.now() - 7 * 86400000;
      const violationsWeek = trips
        .filter((trip) => trip.startedAt > weekAgo)
        .reduce(
          (sum, trip) =>
            sum +
            (trip.events ?? []).filter(
              (event) => !['trip_started', 'trip_ended'].includes(event.type)
            ).length,
          0
        );
      return {
        totalTripsToday: trips.filter((trip) => trip.startedAt > Date.now() - 86400000).length,
        activeTrips: active.length,
        totalViolationsWeek: violationsWeek + seed.violations.length,
        avgFleetSafetyScore: Math.round(
          seed.fleet.reduce((sum, bus) => sum + bus.safetyScore, 0) / seed.fleet.length
        ),
        complianceRate: Math.round(
          (seed.compliance.filter((record) => record.isCompliant).length / seed.compliance.length) * 100
        ),
        sosCountMonth: trips.filter((trip) =>
          (trip.events ?? []).some((event) => event.type === 'sos')
        ).length,
      };
    },
  };
}
