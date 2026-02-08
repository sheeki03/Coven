import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.SARVAM_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const upstream = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ error: 'Upstream error' });
  }
}
