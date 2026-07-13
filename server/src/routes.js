import { askGeminiJson } from './gemini.js';
import * as fallback from './aiFallback.js';

const wrap = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message ?? 'Internal server error' });
  }
};

export function registerRoutes(app, store) {
  // ── Trips ────────────────────────────────────────────────────────────
  app.post('/api/trips', wrap(async (req, res) => {
    res.status(201).json(await store.saveTrip(req.body));
  }));

  app.get('/api/trips', wrap(async (req, res) => {
    res.json(await store.getTrips(req.query.busNo));
  }));

  // ── Fleet / dashboards ───────────────────────────────────────────────
  app.get('/api/fleet', wrap(async (_req, res) => res.json(store.getFleet())));
  app.get('/api/rankings', wrap(async (_req, res) => res.json(store.getRankings())));
  app.get('/api/compliance', wrap(async (_req, res) => res.json(store.getCompliance())));
  app.get('/api/violations', wrap(async (_req, res) => res.json(store.getViolations())));
  app.get('/api/analytics', wrap(async (_req, res) => res.json(await store.getAnalytics())));

  // ── Complaints ───────────────────────────────────────────────────────
  app.get('/api/complaints', wrap(async (_req, res) => res.json(await store.getComplaints())));

  app.post('/api/complaints', wrap(async (req, res) => {
    const { busNo, parentName, text } = req.body;
    const complaint = {
      id: `cmp_${Date.now().toString(36)}`,
      busNo,
      parentName,
      text,
      createdAt: Date.now(),
      status: 'open',
    };
    await store.saveComplaint(complaint);
    res.status(201).json(complaint);
  }));

  app.patch('/api/complaints/:id', wrap(async (req, res) => {
    const { status } = req.body;
    if (!['open', 'reviewing', 'resolved'].includes(status)) {
      res.status(400).json({ message: 'status must be open, reviewing or resolved' });
      return;
    }
    const updated = await store.updateComplaintStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }
    res.json(updated);
  }));

  // ── AI Safety Copilot (Gemini with deterministic fallback) ──────────
  app.post('/api/ai/safety-report', wrap(async (req, res) => {
    const trip = req.body;
    const ai = await askGeminiJson(
      'You are an AI Safety Copilot for school bus transport. From this trip telemetry produce: {"score":number 0-100,"grade":"A"|"B"|"C"|"D","headline":string,"strengths":string[],"risks":string[],"recommendations":string[]}. Be concise and professional.',
      trip
    );
    res.json(ai ?? fallback.safetyReport(trip));
  }));

  app.post('/api/ai/trip-summary', wrap(async (req, res) => {
    const trip = req.body;
    const ai = await askGeminiJson(
      'You are an AI Safety Copilot. Summarize this school bus trip for a parent/school: {"headline":string,"summary":string(2-3 sentences),"riskLevel":"low"|"medium"|"high","highlights":string[]}.',
      trip
    );
    res.json(ai ?? fallback.tripSummary(trip));
  }));

  app.post('/api/ai/complaint', wrap(async (req, res) => {
    const { text } = req.body;
    const ai = await askGeminiJson(
      'Categorize this parent complaint about a school bus: {"category":"Rash Driving"|"Overspeeding"|"Route Issue"|"Delay"|"Vehicle Condition"|"Behaviour"|"Other","severity":"low"|"medium"|"high","summary":string,"suggestedAction":string}.',
      { text }
    );
    res.json(ai ?? fallback.complaintAnalysis(text));
  }));

  app.get('/api/ai/weekly-insights', wrap(async (_req, res) => {
    const analytics = await store.getAnalytics();
    const ai = await askGeminiJson(
      'You are an AI Safety Copilot. From these fleet analytics produce exactly 3 weekly insights as {"insights":[{"title":string,"detail":string,"trend":"up"|"down"|"flat"}]}.',
      { analytics, violations: store.getViolations(), rankings: store.getRankings() }
    );
    res.json(ai?.insights ?? fallback.weeklyInsights());
  }));
}
