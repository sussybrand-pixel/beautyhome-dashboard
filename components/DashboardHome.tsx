import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Image, FileText, Settings, Clock } from "lucide-react";

interface DashboardData {
  sections: { id: string; lastModified: string | null }[];
  imagesCount: number;
  status: { online: boolean; lastUpdated: string | null; version: string | null };
}

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load dashboard data");
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      }
    }
    load();
  }, []);

  const kpiData = useMemo(() => {
    return [
      {
        label: "Portfolio Items",
        value: data?.imagesCount?.toString() || "0",
        icon: Image,
        color: "text-primary",
        bg: "bg-secondary",
      },
    ];
  }, [data]);

  const recentActivity = useMemo(() => {
    if (!data) return [];
    const items = data.sections
      .filter((s) => s.lastModified)
      .map((s) => ({
        section: s.id,
        time: s.lastModified as string,
      }))
      .sort((a, b) => (a.time > b.time ? -1 : 1))
      .slice(0, 5)
      .map((item) => ({
        action: `${item.section.charAt(0).toUpperCase()}${item.section.slice(1)} updated`,
        time: formatRelative(item.time),
        icon: FileText,
      }));
    if (!items.length) {
      return [{ action: "No edits yet", time: "N/A", icon: FileText }];
    }
    return items;
  }, [data]);

  const quickActions = [
    { label: "Edit Content", icon: FileText, page: "content", color: "primary" },
    { label: "Manage Portfolio", icon: Image, page: "images", color: "gold" },
    { label: "Settings", icon: Settings, page: "settings", color: "secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} hover>
              <CardContent className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <h2 className="text-foreground mt-1">{kpi.value}</h2>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-secondary/30 border-none">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-semibold">Website Edits</h3>
                <span className="text-xs text-muted-foreground">Latest content changes</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{activity.action}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {error && <p className="text-sm text-destructive mt-3">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader depth>
              <h3 className="text-white">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.color as any}
                    className="w-full justify-start"
                    onClick={() => onNavigate(action.page)}
                  >
                    <Icon className="w-5 h-5" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <h4 className="text-foreground">Website Status</h4>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                  {data?.status?.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-foreground">
                  {data?.status?.lastUpdated ? formatRelative(data.status.lastUpdated) : "N/A"}
                </span>
              </div>
              {data?.status?.version && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm text-foreground">{data.status.version}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;

function formatRelative(dateString: string | null) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "N/A";
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}
