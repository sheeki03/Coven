import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.SARVAM_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Forward the raw multipart body to Sarvam
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    const body = Buffer.concat(chunks);

    const upstream = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'multipart/form-data',
        'api-subscription-key': apiKey,
      },
      body,
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ error: 'Upstream error' });
  }
}
