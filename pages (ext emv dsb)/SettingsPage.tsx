import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Lock, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface SettingsPageProps {
  onSave: () => void;
}

export function SettingsPage({ onSave }: SettingsPageProps) {
  const [adminName, setAdminName] = useState('John Administrator');
  const [adminEmail, setAdminEmail] = useState('admin@emmavilleacademy.com');
  const [role, setRole] = useState('School Administrator');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [schoolPhone, setSchoolPhone] = useState('(555) 123-4567');
  const [schoolEmail, setSchoolEmail] = useState('info@emmavilleacademy.com');
  const [schoolAddress, setSchoolAddress] = useState('123 Education Street, Learning City, LC 12345');
  const [schoolWebsite, setSchoolWebsite] = useState('www.emmavilleacademy.com');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-white/90">Manage your account and school information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <Card>
          <CardHeader depth>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <h3 className="text-white">Admin Profile</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <Button variant="primary" size="sm">Change Photo</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG or PNG. Max 2MB.</p>
              </div>
            </div>

            <Input
              label="Full Name"
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />

            <Input
              label="Email Address"
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <Input
              label="Role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <Button variant="primary" className="w-full" onClick={onSave}>
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader depth>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-white" />
              <h3 className="text-white">Change Password</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
              </p>
            </div>

            <Input
              label="Current Password"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <Button variant="gold" className="w-full">
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* School Contact Information */}
      <Card>
        <CardHeader depth>
          <h3 className="text-white">School Contact Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Phone Number"
                  id="schoolPhone"
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Email Address"
                  id="schoolEmail"
                  type="email"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Physical Address"
                  id="schoolAddress"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Website URL"
                  id="schoolWebsite"
                  value={schoolWebsite}
                  onChange={(e) => setSchoolWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
            <Button variant="secondary">Reset to Default</Button>
            <Button variant="primary" onClick={onSave}>
              Save School Information
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h4 className="text-foreground">Notification Preferences</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Email notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Content update alerts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground">Security alerts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-foreground">Danger Zone</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-red-900 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-3">
                Permanently delete your admin account. This action cannot be undone.
              </p>
              <Button variant="danger" size="sm">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
