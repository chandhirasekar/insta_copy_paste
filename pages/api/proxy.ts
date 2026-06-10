import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, download } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    if (download === 'true') {
      const extension = contentType.includes('video') ? 'mp4' : 'jpg';
      res.setHeader('Content-Disposition', `attachment; filename="instagram_media.${extension}"`);
    } else {
      res.setHeader('Content-Disposition', 'inline');
    }
    
    res.setHeader('Content-Type', contentType);

    // Pipe the response body to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error('Error proxying download:', error);
    res.status(500).json({ success: false, message: 'Failed to download media' });
  }
}
