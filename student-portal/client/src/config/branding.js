export const UNIVERSITY_NAME = "Rungta International Skill University";

const toDirectGoogleDriveUrl = (url) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (!match?.[1]) {
    return url;
  }
  return `https://drive.google.com/uc?export=view&id=${match[1]}`;
};

const rawLogoUrl = (import.meta.env.VITE_UNIVERSITY_LOGO_URL || "").trim();
export const UNIVERSITY_LOGO_URL = rawLogoUrl ? toDirectGoogleDriveUrl(rawLogoUrl) : "";
