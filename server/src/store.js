const mongoose = require('mongoose');
const seed = require('./seed');

const tripSchema = new mongoose.Schema({}, { strict: false, collection: 'trips' });
const complaintSchema = new mongoose.Schema({}, { strict: false, collection: 'complaints' });

/**
 * Data layer with two backends: MongoDB (when MONGODB_URI is set and
 * reachable) or an in-memory fallback so the server always boots.
 */
async function connectStore(mongoUri) {
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

    getFleet() {
      return seed.fleet.map((bus) => {
        const live = liveBuses.get(bus.busNo);
        return live ? { ...bus, status: live.status } : bus;
      });
    },

    getRankings() {
      return seed.rankings;
    },

    getCompliance() {
      return seed.compliance;
    },

    getViolations() {
      return seed.violations;
    },

    async getAnalytics() {
      const trips = await this.getTrips();
      const active = [...liveBuses.values()].filter((bus) => bus.status === 'active' || bus.status === 'sos');
      const weekAgo = Date.now() - 7 * 86400000;
      const violationsWeek = trips
        .filter((trip) => trip.startedAt > weekAgo)
        .reduce(
          (sum, trip) =>
            sum +
            (trip.events || []).filter(
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
          (trip.events || []).some((event) => event.type === 'sos')
        ).length,
      };
    },
  };
}

module.exports = { connectStore };
