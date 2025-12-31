// Mirror Emmaville pattern: live site APIs, with blob uploads when available
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://beautyhomebysuzain.com";
export const BASE = `${SITE_ORIGIN}/api/content`;
export const UPLOAD_BASE = `${SITE_ORIGIN}/api/upload`;

const BLOB_BUCKET = process.env.NEXT_PUBLIC_BLOB_BUCKET || "susan-makeup-artist-website-blob";
export const BLOB_BASE_URL =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL || `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`;
export const BLOB_TOKEN =
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN;

const hasBlob = Boolean(BLOB_BASE_URL && BLOB_TOKEN);

function blobUrl(key: string) {
  const trimmed = key.startsWith("/") ? key.slice(1) : key;
  const encoded = encodeURI(trimmed);
  return `${BLOB_BASE_URL}/${encoded}`;
}

// Helper to prefix relative asset paths with the site origin
export function withSite(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) return `${SITE_ORIGIN}/${path}`;
  return `${SITE_ORIGIN}${path}`;
}

export async function getSection(section: string) {
  const res = await fetch(`${BASE}/${section}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch section");
  return res.json();
}

export async function updateSection(section: string, data: any) {
  const res = await fetch(`${BASE}/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = "Failed to update section";
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
      if (body?.detail) msg += `: ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function uploadImage(file: File) {
  // Prefer direct blob upload when available
  if (hasBlob) {
    const key = `media/${Date.now()}-${file.name}`;
    const url = blobUrl(key);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        Authorization: `Bearer ${BLOB_TOKEN}`,
      },
      body: file,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Upload failed");
    }
    return { url: `${BLOB_BASE_URL}/${key}` };
  }

  // Fall back to site upload API
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(UPLOAD_BASE, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Upload failed");
  }
  return res.json();
}

export function defaultSection(section: string) {
  switch (section) {
    case "home":
      return {
        hero: {
          eyebrow: "Luxury Makeup",
          title: "BeautyHomeBySuzain",
          subtitle: "Editorial perfection for every occasion",
          slides: [
            {
              title: "Luxury Bridal & Glam Makeup Artist",
              subtitle: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford | Available worldwide",
              image: "/assets/IMG-20251227-WA0030.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Packages",
              secondaryHref: "/packages",
            },
            {
              title: "Celebrate Your Day in Style",
              subtitle: "Exclusive birthday glam packages",
              image: "/assets/IMG-20251227-WA0032.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Packages",
              secondaryHref: "/packages",
            },
            {
              title: "Editorial Perfection",
              subtitle: "Your moment to shine",
              image: "/assets/IMG-20251227-WA0028.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Portfolio",
              secondaryHref: "/catalogue",
            },
          ],
        },
        highlights: [
          { title: "Bridal glam", description: "Flawless bridal looks with luxury finish" },
          { title: "Editorial beauty", description: "Camera-ready artistry for photoshoots" },
          { title: "Travel-ready", description: "London, Manchester, Birmingham, Leeds, Sheffield, Bradford" },
        ],
      };
    case "services":
      return {
        hero: { title: "Our Services", subtitle: "Flawless makeup for every occasion" },
        services: [
          {
            title: "Bridal Glam",
            description: "The ultimate bridal experience to make you look and feel flawless on your wedding day.",
            features: [
              "Bridal trial session",
              "Premium skin prep",
              "Long-lasting finish",
              "Touch-up kit guidance",
            ],
            image: "/assets/IMG-20251227-WA0019.jpg",
          },
          {
            title: "Birthday Glam",
            description: "Celebrate in style with camera-ready glam for your special day.",
            features: ["Full glam makeup", "Premium skin prep", "Photoshoot ready", "Luxury finish"],
            image: "/assets/IMG-20251227-WA0016.jpg",
          },
          {
            title: "Event Glam",
            description: "Statement looks for red carpet, parties, and special events.",
            features: ["High-definition makeup", "Camera-ready finish", "All-day wear", "Custom color matching"],
            image: "/assets/IMG-20251227-WA0026.jpg",
          },
          {
            title: "Editorial / Photoshoot Glam",
            description: "Bold, artistic looks tailored to your vision for shoots.",
            features: ["Editorial styling", "Creative concepts", "Professional collaboration", "Portfolio ready"],
            image: "/assets/IMG-20251227-WA0036.jpg",
          },
        ],
      };
    case "packages":
      return {
        packages: [
          {
            name: "Bridal Package",
            price: "GBP 350.99",
            originalPrice: "Includes premium skin prep and consultation",
            badge: "Client Favorite",
            features: [
              "Bridal trial session tailored to your look",
              "Premium skin prep and luxury finish",
              "3-4 hour full glam session",
              "Two edited videos for reels or memories",
            ],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Travel worldwide by request (fees may apply).",
          },
          {
            name: "Birthday Glam Package",
            price: "NGN 65,000",
            badge: "Exclusive",
            features: [
              "Flawless makeup application",
              "Premium skin prep and lash styling",
              "Birthday photoshoot included",
              "High-quality edited photos",
            ],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Booking fee applies. Photos ready within 4-5 days.",
          },
          {
            name: "Exclusive Birthday Shoot",
            price: "NGN 60,000",
            badge: "Premium",
            features: [
              "30-second reel included",
              "1-2 outfit changes",
              "High-quality photos edited for social",
              "Available at partnered studios or client venues",
            ],
            deliverables: ["Five professionally edited photos", "Cinematic reel"],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Booking fee covers one person only.",
          },
        ],
      };
    case "about":
      return {
        about: {
          title: "Susan Eworo (Suzain)",
          tagline: "Luxury bridal & glam artist",
          bio: "BeautyHomeBySuzain is a luxury makeup brand delivering flawless glam for weddings, birthdays, photoshoots, and special occasions across the UK and Nigeria.",
          travelNote: "Available to travel to any country.",
          image: "/assets/IMG-20251227-WA0018.jpg",
          imageAlt: "Susan Eworo",
        },
        locations: ["London", "Manchester", "Birmingham", "Leeds", "Sheffield", "Bradford"],
        training: [
          "I teach online classes for beginners",
          "One-on-one training and upgrade classes",
          "We sell our courses online and physical",
        ],
      };
    case "portfolio":
      return {
        items: [
          { title: "Bridal elegance", category: "bridal", media: "/assets/IMG-20251227-WA0028.jpg", alt: "Bridal portrait" },
          { title: "Birthday glam", category: "birthday", media: "/assets/IMG-20251227-WA0030.jpg", alt: "Birthday glam" },
          { title: "Editorial glow", category: "editorial", media: "/assets/IMG-20251227-WA0032.jpg", alt: "Editorial glam" },
        ],
      };
    case "contact":
      return {
        phone: "+44 7523 992614",
        whatsapp: "+44 7523 992614",
        whatsappLink: "https://wa.me/447523992614",
        email: "beautyhomebysuzain@gmail.com",
        social: { instagram: "https://instagram.com/beautyhomebysuzain", facebook: "" },
        ctaLabel: "Book Appointment",
        ctaLink: "/book",
        address: { lines: ["London & across the UK", "Available to travel worldwide"] },
        travelNote: "Available to travel to any country.",
      };
    default:
      return {};
  }
}
