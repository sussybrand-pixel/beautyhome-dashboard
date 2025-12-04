'use client';

import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Edit, Home, Info, GraduationCap, Phone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { withSite } from "@/lib/api";

interface ContentManagerProps {
  onNavigate: (page: string, section?: string) => void;
}

const sections = [
  {
    id: "home",
    title: "Home",
    description: "Hero slides and homepage highlights",
    preview: "Nurturing Curious Minds and Building Character",
    icon: Home,
    image: "/images/hero-campus.jpg",
  },
  {
    id: "about",
    title: "About",
    description: "School history, mission, vision, and values",
    preview: "Private K-12 academy dedicated to excellence",
    icon: Info,
    image: "/images/about-campus.jpg",
  },
  {
    id: "admissions",
    title: "Admissions",
    description: "Entry requirements, OSSD pathway, and offers",
    preview: "OSSD Grade 12 pathway, January 2026 intake",
    icon: GraduationCap,
    image: "/images/hero-campus.jpg",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Address, phone, email, map",
    preview: "BX4 3RD Avenue, Port Harcourt | +234 818 628 1225",
    icon: Phone,
    image: "/images/about-campus.jpg",
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
