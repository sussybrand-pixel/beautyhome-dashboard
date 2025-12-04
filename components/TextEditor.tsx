'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";
import { ArrowLeft, Save, X, Eye, Plus, Trash2 } from "lucide-react";
import { getSection, updateSection, uploadImage, withSite } from "@/lib/api";

interface TextEditorProps {
  section?: string;
  onNavigate: (page: string) => void;
  onSave: () => void;
}

const sectionTitles: Record<string, string> = {
  home: "Home",
  about: "About",
  admissions: "Admissions",
  gallery: "Gallery",
  contact: "Contact",
};

export default function TextEditor({
  section = "home",
  onNavigate,
  onSave,
}: TextEditorProps) {
  const [rawJson, setRawJson] = useState("{}");
  const [prettyJson, setPrettyJson] = useState("");
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
      const url = withSite(res.url || res?.data?.url || "");
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
        const data = await getSection(section);
        const pretty = JSON.stringify(data, null, 2);
        setData(data);
        setRawJson(pretty);
        setPrettyJson(pretty);
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

  // Form editors -------------------------------------------------------------
  const HomeForm = useMemo(() => {
    if (!data) return null;
    const slides = data?.hero?.slides || [];
    const programs = data?.programs || [];
    return (
      <div className="space-y-8">
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
                      setData({ ...data, hero: { ...data.hero, slides: next } });
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
                    setData({ ...data, hero: { ...data.hero, slides: next } });
                  }}
                />
                <Input
                  label="Label"
                  value={slide.label || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], label: e.target.value };
                    setData({ ...data, hero: { ...data.hero, slides: next } });
                  }}
                />
                <Input
                  label="Image URL"
                  value={slide.image || ""}
                  onChange={(e) => {
                    const next = [...slides];
                    next[idx] = { ...next[idx], image: e.target.value };
                    setData({ ...data, hero: { ...data.hero, slides: next } });
                  }}
                  rightSlot={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        triggerUpload((url) => {
                          const next = [...slides];
                          next[idx] = { ...next[idx], image: url };
                          setData({ ...data, hero: { ...data.hero, slides: next } });
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
                { image: "", title: "New Slide", label: "Label" },
              ];
              setData({ ...data, hero: { ...data.hero, slides: next } });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Programs</h4>
          {programs.map((p: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Program {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = programs.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, programs: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Title"
                  value={p.title || ""}
                  onChange={(e) => {
                    const next = [...programs];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, programs: next });
                  }}
                />
                <Textarea
                  label="Description"
                  value={p.description || ""}
                  onChange={(e) => {
                    const next = [...programs];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setData({ ...data, programs: next });
                  }}
                />
                <Input
                  label="Image URL"
                  value={p.image || ""}
                  onChange={(e) => {
                    const next = [...programs];
                    next[idx] = { ...next[idx], image: e.target.value };
                    setData({ ...data, programs: next });
                  }}
                  rightSlot={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        triggerUpload((url) => {
                          const next = [...programs];
                          next[idx] = { ...next[idx], image: url };
                          setData({ ...data, programs: next });
                        })
                      }
                    >
                      Upload
                    </Button>
                  }
                />
                <Input
                  label="Label (alt text)"
                  value={p.label || ""}
                  onChange={(e) => {
                    const next = [...programs];
                    next[idx] = { ...next[idx], label: e.target.value };
                    setData({ ...data, programs: next });
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
                ...programs,
                { title: "New Program", description: "", image: "", label: "" },
              ];
              setData({ ...data, programs: next });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Program
          </Button>
        </div>
      </div>
    );
  }, [data]);

  const AdmissionsForm = useMemo(() => {
    if (!data) return null;
    const hero = data?.hero || {};
    const osdd = data?.osdd || {};
    const intake = data?.intake || {};
    const health = data?.health || {};
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">Hero</h4>
            <Input
              label="Title"
              value={hero.title || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, title: e.target.value } })}
            />
            <Textarea
              label="Body"
              value={hero.body || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, body: e.target.value } })}
            />
            <Input
              label="Image URL"
              value={hero.image || ""}
              onChange={(e) => setData({ ...data, hero: { ...hero, image: e.target.value } })}
              rightSlot={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    triggerUpload((url) =>
                      setData({ ...data, hero: { ...hero, image: url } }),
                    )
                  }
                >
                  Upload
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">OSSD Pathway</h4>
            <Input
              label="Heading"
              value={osdd.heading || ""}
              onChange={(e) => setData({ ...data, osdd: { ...osdd, heading: e.target.value } })}
            />
            <Textarea
              label="Body"
              value={osdd.body || ""}
              onChange={(e) => setData({ ...data, osdd: { ...osdd, body: e.target.value } })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">Intake</h4>
            <Input
              label="Title"
              value={intake.title || ""}
              onChange={(e) => setData({ ...data, intake: { ...intake, title: e.target.value } })}
            />
            <Input
              label="Offer"
              value={intake.offer || ""}
              onChange={(e) => setData({ ...data, intake: { ...intake, offer: e.target.value } })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">Health / Inoculation</h4>
            <Input
              label="Title"
              value={health.title || ""}
              onChange={(e) => setData({ ...data, health: { ...health, title: e.target.value } })}
            />
            <Textarea
              label="Body"
              value={health.body || ""}
              onChange={(e) => setData({ ...data, health: { ...health, body: e.target.value } })}
            />
          </CardContent>
        </Card>
      </div>
    );
  }, [data]);

  const AboutForm = useMemo(() => {
    if (!data) return null;
    const about = data?.about || {};
    const values = data?.values || [];
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
            <Textarea
              label="Description"
              value={about.description || ""}
              onChange={(e) =>
                setData({ ...data, about: { ...about, description: e.target.value } })
              }
            />
            <Input
              label="Quote"
              value={about.quote || ""}
              onChange={(e) => setData({ ...data, about: { ...about, quote: e.target.value } })}
            />
            <Input
              label="Image URL"
              value={about.image || ""}
              onChange={(e) => setData({ ...data, about: { ...about, image: e.target.value } })}
              rightSlot={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    triggerUpload((url) =>
                      setData({ ...data, about: { ...about, image: url } }),
                    )
                  }
                >
                  Upload
                </Button>
              }
            />
            <Input
              label="Image Alt"
              value={about.imageAlt || ""}
              onChange={(e) =>
                setData({ ...data, about: { ...about, imageAlt: e.target.value } })
              }
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Values</h4>
          {values.map((v: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Value {idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = values.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, values: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  label="Title"
                  value={v.title || ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, values: next });
                  }}
                />
                <Textarea
                  label="Description"
                  value={v.description || ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setData({ ...data, values: next });
                  }}
                />
                <Input
                  label="Icon (target/eye/heart)"
                  value={v.icon || ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = { ...next[idx], icon: e.target.value };
                    setData({ ...data, values: next });
                  }}
                />
                <Input
                  label="Color (e.g. emerald)"
                  value={v.color || ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = { ...next[idx], color: e.target.value };
                    setData({ ...data, values: next });
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
                ...values,
                { title: "New Value", description: "", icon: "target", color: "emerald" },
              ];
              setData({ ...data, values: next });
            }}
          >
            <Plus className="w-4 h-4" />
            Add Value
          </Button>
        </div>
      </div>
    );
  }, [data]);

  const ContactForm = useMemo(() => {
    if (!data) return null;
    const addressLines = (data?.address?.lines || []).join("\n");
    const social = data?.social || {};
    return (
      <div className="space-y-4">
        <Textarea
          label="Address (one line per row)"
          value={addressLines}
          onChange={(e) => {
            const lines = e.target.value.split("\n");
            setData({ ...data, address: { ...(data.address || {}), lines } });
          }}
        />
        <Input
          label="Phone"
          value={data?.phone || ""}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
        <Input
          label="Email"
          value={data?.email || ""}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <Input
          label="Instagram URL"
          value={social.instagram || ""}
          onChange={(e) =>
            setData({ ...data, social: { ...social, instagram: e.target.value } })
          }
        />
        <Input
          label="Facebook URL"
          value={social.facebook || ""}
          onChange={(e) =>
            setData({ ...data, social: { ...social, facebook: e.target.value } })
          }
        />
        <Input
          label="Map Embed URL"
          value={data?.mapEmbedUrl || ""}
          onChange={(e) => setData({ ...data, mapEmbedUrl: e.target.value })}
        />
      </div>
    );
  }, [data]);

  const formForSection = useMemo(() => {
    if (!data) return null;
    switch (section) {
      case "home":
        return HomeForm;
      case "admissions":
        return AdmissionsForm;
      case "about":
        return AboutForm;
      case "contact":
        return ContactForm;
      default:
        return (
          <p className="text-sm text-muted-foreground">
            No form editor for this section. Use JSON mode.
          </p>
        );
    }
  }, [section, data, HomeForm, AdmissionsForm, AboutForm, ContactForm]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => onNavigate("content")}>
        <ArrowLeft className="w-4 h-4" />
        Back to Content Manager
      </Button>

      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">
          Edit {sectionTitles[section] || section} Content
        </h1>
        <p className="text-white/90">
          Use the form editor or switch to JSON for advanced edits.
        </p>
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
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
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
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleSave}
                      disabled={saving}
                    >
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
                <pre className="text-sm whitespace-pre-wrap break-words text-foreground">
                  {rawJson}
                </pre>
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
      {/* Hidden file input for Upload buttons */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUploadFile}
        className="hidden"
      />
    </div>
  );
}
