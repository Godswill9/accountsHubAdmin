import redditLogo from './reddit.jpg'
import twitchLogo from './twitch.png'
import tumblrLogo from './tumblr.png'
import kakaotalkLogo from './kakaotalk.png'
import soundcloudLogo from './soundcloud.jpg'
import wechatlogo from './wechat.png'


// Logos are served from public/platforms (downloaded once; hotlinked Wikimedia thumbs broke).
const platformImages: { [key: string]: string } = {
  facebook: "/platforms/facebook.svg",
  instagram: "/platforms/instagram.svg",
  twitter: "/platforms/twitter.svg",
  reddit: redditLogo,
  youtube: "/platforms/youtube.svg",
  tiktok: "/platforms/tiktok.svg",
  linkedin: "/platforms/linkedin.png",
  gmail: "/platforms/gmail.svg",
  snapchat: "/platforms/snapchat.svg",
  telegram: "/platforms/telegram.svg",
  whatsapp: "/platforms/whatsapp.svg",
  pinterest: "/platforms/pinterest.png",
  discord: "/platforms/discord.svg",
  twitch: twitchLogo,
  tumblr: tumblrLogo,
  vimeo: "/platforms/vimeo.svg",
  medium: "/platforms/medium.svg",
  quora: "/platforms/quora.svg",
  wechat: wechatlogo,
  kakaotalk: kakaotalkLogo,
  spotify: "/platforms/spotify.svg",
  soundcloud: soundcloudLogo,
  apple: "/platforms/apple.svg",
  amazon: "/platforms/amazon.svg",
  microsoft: "/platforms/microsoft.svg",
  default: "/placeholder.svg"
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
