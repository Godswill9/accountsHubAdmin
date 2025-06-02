import redditLogo from './reddit.jpg'
import twitchLogo from './twitch.png'
import tumblrLogo from './tumblr.png'
import kakaotalkLogo from './kakaotalk.png'
import soundcloudLogo from './soundcloud.jpg'
import wechatlogo from './wechat.png'


const platformImages: { [key: string]: string } = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png",
  twitter: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/X_logo_2023_original.svg/2048px-X_logo_2023_original.svg.png",
  reddit: redditLogo,
  youtube: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png",
  tiktok: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/2560px-TikTok_logo.svg.png",
  linkedin: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png",
  gmail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
  snapchat: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png",
  telegram: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png",
  whatsapp: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  pinterest: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
  discord: "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg",
  twitch: twitchLogo,
  tumblr: tumblrLogo,
  vimeo:"https://upload.wikimedia.org/wikipedia/commons/9/9c/Vimeo_Logo.svg",
  medium: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Medium_logo_Monogram.svg",
  quora: "https://upload.wikimedia.org/wikipedia/commons/9/91/Quora_logo_2015.svg",
  wechat: "https://upload.wikimedia.org/wikipedia/commons/2/2d/WeChat_Logo.png",
  kakaotalk: kakaotalkLogo,
  spotify: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
  soundcloud: soundcloudLogo,
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  default: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png"
};

export const getPlatformImage = (platformName: string): string => {
  const normalizedPlatform = platformName.toLowerCase().trim();
  for (const [platform, image] of Object.entries(platformImages)) {
    if (normalizedPlatform.includes(platform)) {
      return image;
    }
  }
  return platformImages.default;
};
