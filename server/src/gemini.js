const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Calls Gemini and parses a JSON object out of the response. Returns null on
 * any failure (missing key, network, malformed output) so callers can fall
 * back to deterministic heuristics — the API never breaks the demo.
 */
async function askGeminiJson(instruction, payload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `${instruction}\n\nRespond with ONLY a valid JSON object, no markdown fences.\n\nDATA:\n${JSON.stringify(payload).slice(0, 12000)}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
        }),
      }
    );
    if (!response.ok) {
      console.warn('Gemini API error:', response.status, await response.text());
      return null;
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text.replace(/^```json\s*|```\s*$/g, ''));
  } catch (error) {
    console.warn('Gemini call failed:', error.message);
    return null;
  }
}

module.exports = { askGeminiJson };
