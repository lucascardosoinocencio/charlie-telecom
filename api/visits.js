const COUNTER_KEY = "charlietelecom-site-visitas";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!baseUrl || !token) {
    res.status(500).json({ error: "KV not configured" });
    return;
  }

  try {
    const upstashRes = await fetch(`${baseUrl}/incr/${COUNTER_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!upstashRes.ok) throw new Error("upstash request failed");

    const data = await upstashRes.json();
    const value = typeof data.result === "number" ? data.result : Number(data.result);

    if (!Number.isFinite(value)) throw new Error("invalid counter value");

    res.status(200).json({ value });
  } catch (err) {
    res.status(502).json({ error: "counter unavailable" });
  }
};
