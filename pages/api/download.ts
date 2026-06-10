import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  message?: string;
  data?: {
    mediaUrl: string;
    thumbnail?: string;
    type: 'video' | 'image';
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.includes('instagram.com')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid Instagram URL.' });
  }

  try {
    // Use instagram-url-direct to extract the media link
    const { instagramGetUrl } = await import('instagram-url-direct');
    const links = await instagramGetUrl(url);

    if (!links || !links.url_list || links.url_list.length === 0) {
      return res.status(400).json({ success: false, message: 'Could not extract media from the provided URL.' });
    }

    const mediaUrl = links.url_list[0];
    const mediaDetails = links.media_details && links.media_details[0];
    const mediaType = mediaDetails && mediaDetails.type === 'image' ? 'image' : 'video';
    const thumbnail = (mediaDetails && mediaDetails.thumbnail) ? mediaDetails.thumbnail : mediaUrl;

    return res.status(200).json({
      success: true,
      message: 'Media extracted successfully',
      data: {
        mediaUrl: mediaUrl,
        type: mediaType,
        thumbnail: thumbnail,
      },
    });
  } catch (error) {
    console.error('Error extracting Instagram media:', error);
    return res.status(500).json({ success: false, message: 'Failed to extract media. Please try again later.' });
  }
}
