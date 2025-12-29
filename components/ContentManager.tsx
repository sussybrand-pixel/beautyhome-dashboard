'use client';

import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Edit, Home, Info, Sparkles, Phone, Gift, Images } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { withSite } from "@/lib/api";

interface ContentManagerProps {
  onNavigate: (page: string, section?: string) => void;
}

const sections = [
  {
    id: "home",
    title: "Home & Hero",
    description: "Hero carousel, taglines, and CTAs",
    preview: "Luxury bridal & glam makeup artist",
    icon: Home,
    image: "/assets/IMG-20251227-WA0030.jpg",
  },
  {
    id: "about",
    title: "About & Locations",
    description: "Bio, cities covered, travel note, training",
    preview: "Available in London, Manchester, Birmingham, Leeds, Sheffield, Bradford",
    icon: Info,
    image: "/assets/IMG-20251227-WA0018.jpg",
  },
  {
    id: "services",
    title: "Services",
    description: "Service offerings, features, and imagery",
    preview: "Bridal Glam · Birthday Glam · Event Glam · Editorial",
    icon: Sparkles,
    image: "/assets/IMG-20251227-WA0036.jpg",
  },
  {
    id: "packages",
    title: "Packages",
    description: "Package pricing, deliverables, availability",
    preview: "Bridal Package · Birthday Glam Package · Exclusive Birthday Shoot",
    icon: Gift,
    image: "/assets/IMG-20251227-WA0028.jpg",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "All work (bridal, birthday, glam, editorial)",
    preview: "Photos + GIF reels categorized for the site",
    icon: Images,
    image: "/assets/IMG-20251227-WA0032.jpg",
  },
  {
    id: "contact",
    title: "Contact & Social",
    description: "Phone, WhatsApp, email, Instagram, CTAs",
    preview: "+44 7523 992614 | @beautyhomebysuzain",
    icon: Phone,
    image: "/assets/IMG-20251227-WA0016.jpg",
  },
];

export default function ContentManager({ onNavigate }: ContentManagerProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} hover>
              <div className="relative h-40 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={withSite(section.image)}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-white">{section.title}</h3>
                </div>
              </div>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-foreground line-clamp-2">{section.preview}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigate("editor", section.id)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
