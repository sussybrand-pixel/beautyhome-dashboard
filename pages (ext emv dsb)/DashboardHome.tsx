import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Image, TrendingUp, FileText, Settings, Clock } from 'lucide-react';

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const kpiData = [
    { label: 'Images Updated', value: '23', icon: Image, color: 'text-primary', bg: 'bg-secondary' },
    { label: 'Site Visits', value: '12.4K', icon: TrendingUp, color: 'text-accent', bg: 'bg-amber-50' },
  ];

  const recentActivity = [
    { action: 'Hero section updated', time: '2 hours ago', icon: FileText },
    { action: 'Gallery image replaced', time: '5 hours ago', icon: Image },
    { action: 'About page content modified', time: '1 day ago', icon: FileText },
    { action: 'Admission information updated', time: '2 days ago', icon: FileText },
    { action: 'Contact details changed', time: '3 days ago', icon: Settings },
  ];

  const quickActions = [
    { label: 'Edit Content', icon: FileText, page: 'content', color: 'primary' },
    { label: 'Manage Images', icon: Image, page: 'images', color: 'gold' },
    { label: 'Settings', icon: Settings, page: 'settings', color: 'secondary' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Welcome back, Admin!</h1>
        <p className="text-white/90">Here's what's happening with your school website today.</p>
      </div>

      {/* KPI Cards */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader depth>
              <h3 className="text-white">Recent Activity</h3>
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
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
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

          {/* Website Stats */}
          <Card className="mt-6">
            <CardHeader>
              <h4 className="text-foreground">Website Status</h4>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-foreground">Today, 2:30 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm text-foreground">2.5.1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
