import { instagramGetUrl } from 'instagram-url-direct';

async function run() {
  try {
    const url = 'https://www.instagram.com/reel/DZXaI7-l3v7/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==';
    const links = await instagramGetUrl(url);
    console.log(JSON.stringify(links, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
