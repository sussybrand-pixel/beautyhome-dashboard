'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";
import { ArrowLeft, Save, X, Eye, Plus, Trash2 } from "lucide-react";
import { getSection, updateSection, uploadImage } from "@/lib/api";

type SectionId = "home" | "about" | "services" | "packages" | "portfolio" | "contact" | string;

type TextEditorProps = {
  section?: SectionId;
  onNavigate: (page: string) => void;
  onSave: () => void;
};

const sectionTitles: Record<string, string> = {
  home: "Home",
  about: "About",
  services: "Services",
  packages: "Packages",
  portfolio: "Portfolio",
  contact: "Contact",
};

const categoryOptions = ["bridal", "birthday", "glam", "editorial"];

export default function TextEditor({ section = "home", onNavigate, onSave }: TextEditorProps) {
  const [rawJson, setRawJson] = useState("{}");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"form" | "json">("form");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingSetter, setPendingSetter] = useState<((url: string) => void) | null>(null);

  const triggerUpload = (setter: (url: string) => void) => {
    setPendingSetter(() => setter);
    fileInputRef.current?.click();
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSetter) return;
    try {
      setSaving(true);
      const res = await uploadImage(file);
      const url = res.url || res?.data?.url || "";
      pendingSetter(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
      setPendingSetter(null);
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const incoming = await getSection(section);
        const pretty = JSON.stringify(incoming, null, 2);
        setData(incoming);
        setRawJson(pretty);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [section]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const payload = mode === "json" ? JSON.parse(rawJson) : data;
      await updateSection(section, payload);
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON or save failed");
    } finally {
      setSaving(false);
    }
  };

  const HomeForm = useMemo(() => {
    if (!data) return null;
    const hero = data?.hero || {};
    const slides = hero.slides || [];
    const highlights = data?.highlights || [];
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">Hero Heading</h4>
            <Input
              label="Eyebrow / Overline"
              value={hero.eyebrow || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, eyebrow: e.target.value } })}
            />
            <Input
              label="Headline"
              value={hero.title || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, title: e.target.value } })}
            />
            <Textarea
              label="Subheadline"
              value={hero.subtitle || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, subtitle: e.target.value } })}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Hero Slides</h4>
          {slides.map((slide: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Slide {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = slides.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, hero: { ...hero, slides: next } });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Title"
                  value={slide.title || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Textarea
                  label="Subtitle"
                  value={slide.subtitle || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], subtitle: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Input
                  label="Primary CTA Label"
                  value={slide.primaryLabel || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], primaryLabel: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Input
                  label="Primary CTA Link"
                  value={slide.primaryHref || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], primaryHref: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Input
                  label="Secondary CTA Label"
                  value={slide.secondaryLabel || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], secondaryLabel: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Input
                  label="Secondary CTA Link"
                  value={slide.secondaryHref || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], secondaryHref: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                />
                <Input
                  label="Image URL"
                  value={slide.image || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], image: e.target.value };
                    setData({ ...data, hero: { ...hero, slides: next } });
                  }}
                  rightSlot={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        triggerUpload((url) => {
                          const next = [...slides];
                          next[idx] = { ...next[idx], image: url };
                          setData({ ...data, hero: { ...hero, slides: next } });
                        })
                      }
                    >
                      Upload
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = [
                ...slides,
                {
                  title: "New Slide",
                  subtitle: "",
                  primaryLabel: "Book Appointment",
                  primaryHref: "https://wa.me/447523992614",
                  secondaryLabel: "View Packages",
                  secondaryHref: "/packages",
                  image: "",
                },
              ];
              setData({ ...data, hero: { ...hero, slides: next } });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Highlights</h4>
          {highlights.map((item: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Highlight {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = highlights.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, highlights: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Title"
                  value={item.title || ""}
                  onChange={(e) => {
                    const next = [...highlights];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, highlights: next });
                  }}
                />
                <Textarea
                  label="Description"
                  value={item.description || ""}
                  onChange={(e) => {
                    const next = [...highlights];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setData({ ...data, highlights: next });
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = [...highlights, { title: "New highlight", description: "" }];
              setData({ ...data, highlights: next });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </Button>
        </div>
      </div>
    );
  }, [data]);

  const ServicesForm = useMemo(() => {
    if (!data) return null;
    const hero = data?.hero || {};
    const services = data?.services || [];
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">Services Hero</h4>
            <Input
              label="Title"
              value={hero.title || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, title: e.target.value } })}
            />
            <Textarea
              label="Subtitle"
              value={hero.subtitle || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, subtitle: e.target.value } })}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Services</h4>
          {services.map((svc: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Service {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = services.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, services: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Title"
                  value={svc.title || ""}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, services: next });
                  }}
                />
                <Textarea
                  label="Description"
                  value={svc.description || ""}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setData({ ...data, services: next });
                  }}
                />
                <Textarea
                  label="Features (one per line)"
                  value={(svc.features || []).join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").filter(Boolean);
                    const next = [...services];
                    next[idx] = { ...next[idx], features: lines };
                    setData({ ...data, services: next });
                  }}
                />
                <Input
                  label="Image URL"
                  value={svc.image || ""}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx] = { ...next[idx], image: e.target.value };
                    setData({ ...data, services: next });
                  }}
                  rightSlot={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        triggerUpload((url) => {
                          const next = [...services];
                          next[idx] = { ...next[idx], image: url };
                          setData({ ...data, services: next });
                        })
                      }
                    >
                      Upload
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = [
                ...services,
                { title: "New Service", description: "", features: [], image: "" },
              ];
              setData({ ...data, services: next });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>
    );
  }, [data]);

  const PackagesForm = useMemo(() => {
    if (!data) return null;
    const packages = data?.packages || [];
    return (
      <div className="space-y-4">
        {packages.map((pkg: any, idx: number) => (
          <Card key={idx}>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Package {idx + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = packages.filter((_: any, i: number) => i !== idx);
                    setData({ ...data, packages: next });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                label="Name"
                value={pkg.name || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], name: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
              <Input
                label="Price"
                value={pkg.price || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], price: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
              <Input
                label="Original Price / Subtext"
                value={pkg.originalPrice || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], originalPrice: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
              <Input
                label="Badge"
                value={pkg.badge || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], badge: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
              <Textarea
                label="Features (one per line)"
                value={(pkg.features || []).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n").filter(Boolean);
                  const next = [...packages];
                  next[idx] = { ...next[idx], features: lines };
                  setData({ ...data, packages: next });
                }}
              />
              <Textarea
                label="Deliverables (one per line)"
                value={(pkg.deliverables || []).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n").filter(Boolean);
                  const next = [...packages];
                  next[idx] = { ...next[idx], deliverables: lines };
                  setData({ ...data, packages: next });
                }}
              />
              <Input
                label="Availability"
                value={pkg.availability || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], availability: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
              <Input
                label="Note"
                value={pkg.note || ""}
                onChange={(e) => {
                  const next = [...packages];
                  next[idx] = { ...next[idx], note: e.target.value };
                  setData({ ...data, packages: next });
                }}
              />
            </CardContent>
          </Card>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const next = [
              ...packages,
              {
                name: "New Package",
                price: "",
                originalPrice: "",
                badge: "",
                features: [],
                deliverables: [],
                availability: "",
                note: "",
              },
            ];
            setData({ ...data, packages: next });
          }}
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>
    );
  }, [data]);

  const AboutForm = useMemo(() => {
    if (!data) return null;
    const about = data?.about || {};
    const locations = data?.locations || [];
    const training = data?.training || [];
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">About</h4>
            <Input
              label="Title"
              value={about.title || ""}
              onChange={(e) => setData({ ...data, about: { ...about, title: e.target.value } })}
            />
            <Input
              label="Tagline"
              value={about.tagline || ""}
              onChange={(e) => setData({ ...data, about: { ...about, tagline: e.target.value } })}
            />
            <Textarea
              label="Bio"
              value={about.bio || ""}
              onChange={(e) => setData({ ...data, about: { ...about, bio: e.target.value } })}
            />
            <Textarea
              label="Travel Note"
              value={about.travelNote || ""}
              onChange={(e) => setData({ ...data, about: { ...about, travelNote: e.target.value } })}
            />
            <Input
              label="Hero Image"
              value={about.image || ""}
              onChange={(e) => setData({ ...data, about: { ...about, image: e.target.value } })}
              rightSlot={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    triggerUpload((url) => setData({ ...data, about: { ...about, image: url } }))
                  }
                >
                  Upload
                </Button>
              }
            />
            <Input
              label="Hero Alt"
              value={about.imageAlt || ""}
              onChange={(e) => setData({ ...data, about: { ...about, imageAlt: e.target.value } })}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Locations (one per line)</h4>
          <Textarea
            label="Cities"
            value={locations.join("\n")}
            onChange={(e) => setData({ ...data, locations: e.target.value.split("\n").filter(Boolean) })}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Training & Courses</h4>
          {training.map((item: string, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Item {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = training.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, training: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Text"
                  value={item}
                  onChange={(e) => {
                    const next = [...training];
                    next[idx] = e.target.value;
                    setData({ ...data, training: next });
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setData({ ...data, training: [...training, "New training offer"] })}
          >
            <Plus className="w-4 h-4" />
            Add Training Item
          </Button>
        </div>
      </div>
    );
  }, [data]);

  const PortfolioForm = useMemo(() => {
    if (!data) return null;
    const items = data?.items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
          <Card key={idx}>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Item {idx + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = items.filter((_: any, i: number) => i !== idx);
                    setData({ ...data, items: next });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                label="Title"
                value={item.title || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setData({ ...data, items: next });
                }}
              />
              <Textarea
                label="Description"
                value={item.description || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, items: next });
                }}
              />
              <label className="text-sm text-foreground">Category</label>
              <select
                className="w-full rounded border border-border bg-background p-2"
                value={item.category || "bridal"}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], category: e.target.value };
                  setData({ ...data, items: next });
                }}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Input
                label="Media URL (image or GIF)"
                value={item.media || item.image || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], media: e.target.value };
                  setData({ ...data, items: next });
                }}
                rightSlot={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      triggerUpload((url) => {
                        const next = [...items];
                        next[idx] = { ...next[idx], media: url };
                        setData({ ...data, items: next });
                      })
                    }
                  >
                    Upload
                  </Button>
                }
              />
              <Input
                label="Alt Text"
                value={item.alt || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], alt: e.target.value };
                  setData({ ...data, items: next });
                }}
              />
            </CardContent>
          </Card>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const next = [
              ...items,
              {
                title: "New Portfolio Item",
                description: "",
                category: "bridal",
                media: "",
                alt: "",
              },
            ];
            setData({ ...data, items: next });
          }}
        >
          <Plus className="w-4 h-4" />
          Add Portfolio Item
        </Button>
      </div>
    );
  }, [data]);

  const ContactForm = useMemo(() => {
    if (!data) return null;
    const addressLines = (data?.address?.lines || []).join("\n");
    const social = data?.social || {};
    return (
      <div className="space-y-4">
        <Input
          label="Phone"
          value={data?.phone || ""}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
        <Input
          label="WhatsApp Number"
          value={data?.whatsapp || ""}
          onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
        />
        <Input
          label="WhatsApp Link"
          value={data?.whatsappLink || ""}
          onChange={(e) => setData({ ...data, whatsappLink: e.target.value })}
        />
        <Input
          label="Email"
          value={data?.email || ""}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <Input
          label="Instagram URL"
          value={social.instagram || ""}
          onChange={(e) => setData({ ...data, social: { ...social, instagram: e.target.value } })}
        />
        <Input
          label="Booking CTA Label"
          value={data?.ctaLabel || ""}
          onChange={(e) => setData({ ...data, ctaLabel: e.target.value })}
        />
        <Input
          label="Booking CTA Link"
          value={data?.ctaLink || ""}
          onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
        />
        <Textarea
          label="Address (one line per row)"
          value={addressLines}
          onChange={(e) => {
            const lines = e.target.value.split("\n");
            setData({ ...data, address: { ...(data.address || {}), lines } });
          }}
        />
        <Textarea
          label="Travel Note"
          value={data?.travelNote || ""}
          onChange={(e) => setData({ ...data, travelNote: e.target.value })}
        />
      </div>
    );
  }, [data]);

  const formForSection = useMemo(() => {
    if (!data) return null;
    switch (section) {
      case "home":
        return HomeForm;
      case "services":
        return ServicesForm;
      case "packages":
        return PackagesForm;
      case "about":
        return AboutForm;
      case "portfolio":
        return PortfolioForm;
      case "contact":
        return ContactForm;
      default:
        return (
          <p className="text-sm text-muted-foreground">
            No form editor for this section. Use JSON mode.
          </p>
        );
    }
  }, [section, data, HomeForm, ServicesForm, PackagesForm, AboutForm, PortfolioForm, ContactForm]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => onNavigate("content")}>
        <ArrowLeft className="w-4 h-4" />
        Back to Content Manager
      </Button>

      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Edit {sectionTitles[section] || section} Content</h1>
        <p className="text-white/90">Use the form editor or switch to JSON for advanced edits.</p>
        <div className="mt-3 flex gap-2">
          <Button
            variant={mode === "form" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("form")}
          >
            Form Editor
          </Button>
          <Button
            variant={mode === "json" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("json")}
          >
            JSON (Advanced)
          </Button>
        </div>
      </div>

      {mode === "form" ? (
        <Card>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {formForSection}
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save & Publish"}
                  </Button>
                  <Button variant="secondary" onClick={() => onNavigate("content")}>
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader depth>
              <h3 className="text-white">JSON Editor</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <Textarea
                    label="Section JSON"
                    id="section-json"
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    rows={20}
                    placeholder="{ ... }"
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save & Publish"}
                    </Button>
                    <Button variant="secondary" onClick={() => onNavigate("content")}>
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader depth>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="text-white">Preview (JSON)</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border min-h-[500px]">
                <pre className="text-sm whitespace-pre-wrap break-words text-foreground">{rawJson}</pre>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>Tip:</strong> Copy/paste valid JSON. The website reads this file directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUploadFile} className="hidden" />
    </div>
  );
}
