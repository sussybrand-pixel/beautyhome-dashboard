import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { User, Lock, Phone, Mail, MapPin, Globe } from "lucide-react";

interface SettingsPageProps {
  onSave: () => void;
}

function SettingsPage({ onSave }: SettingsPageProps) {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [role, setRole] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolWebsite, setSchoolWebsite] = useState("");
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load settings");
        setAdminName(data?.profile?.name || "");
        setAdminEmail(data?.profile?.email || "");
        setRole(data?.profile?.role || "");
        setAdminUsername(data?.admin?.username || "");
        setSchoolPhone(data?.general?.phone || "");
        setSchoolEmail(data?.general?.email || data?.profile?.email || "");
        setSchoolAddress(data?.general?.address || "");
        setSchoolWebsite(data?.general?.website || "");
        setSiteName(data?.general?.siteName || "");
        setTagline(data?.general?.tagline || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveProfile = async () => {
    setSuccess("");
    setError("");
    const payload = {
      profile: { name: adminName, email: adminEmail, role },
      admin: { username: adminUsername },
      general: { siteName, tagline, phone: schoolPhone, address: schoolAddress, website: schoolWebsite, email: schoolEmail },
    };
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to save settings");
    } else {
      setSuccess("Settings saved");
      onSave();
    }
  };

  const changePassword = async () => {
    setSuccess("");
    setError("");
    if (!newPassword || newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin: { username: adminUsername, newPassword } }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to update password");
    } else {
      setSuccess("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-white/90">Manage your account and BeautyHomeBySuzain information</p>
        {loading && <p className="text-white/80 text-sm mt-2">Loading settings...</p>}
        {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
        {success && <p className="text-emerald-100 text-sm mt-2">{success}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader depth>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <h3 className="text-white">Admin Profile</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
              value={adminName || "BeautyHome Admin"}
              onChange={(e) => setAdminName(e.target.value)}
            />
            <Input
              label="Username"
              id="adminUsername"
              value={adminUsername || "beautyhome admin"}
              onChange={(e) => setAdminUsername(e.target.value)}
            />

            <Input
              label="Email Address"
              id="adminEmail"
              type="email"
              value={adminEmail || "admin@beautyhomebysuzain.com"}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <Input label="Role" id="role" value={role || "Administrator"} onChange={(e) => setRole(e.target.value)} />

            <Button variant="primary" className="w-full" onClick={saveProfile}>Save Profile Changes</Button>
          </CardContent>
        </Card>

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
              type={showPass ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              rightSlot={
                <button type="button" className="text-sm text-primary" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              }
            />

            <Input
              label="New Password"
              id="newPassword"
              type={showNewPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              rightSlot={
                <button type="button" className="text-sm text-primary" onClick={() => setShowNewPass((v) => !v)}>
                  {showNewPass ? "Hide" : "Show"}
                </button>
              }
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              rightSlot={
                <button type="button" className="text-sm text-primary" onClick={() => setShowConfirmPass((v) => !v)}>
                  {showConfirmPass ? "Hide" : "Show"}
                </button>
              }
            />

            <Button variant="gold" className="w-full" onClick={changePassword}>
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader depth>
          <h3 className="text-white">Site Contact Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Input
                label="Site Name"
                id="siteName"
                value={siteName || "BeautyHomeBySuzain"}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <Input
                label="Tagline"
                id="tagline"
                value={tagline || "Luxury Bridal & Glam Makeup Artist"}
                onChange={(e) => setTagline(e.target.value)}
              />

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Phone Number"
                  id="schoolPhone"
                  value={schoolPhone || "+44 7523 992614"}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Email Address"
                  id="schoolEmail"
                  type="email"
                  value={schoolEmail || "admin@beautyhomebysuzain.com"}
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
                  value={schoolAddress || "London · Manchester · Birmingham · Leeds · Sheffield · Bradford"}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary mt-3" />
                <Input
                  label="Website URL"
                  id="schoolWebsite"
                  value={schoolWebsite || "https://beautyhomebysuzain.com"}
                  onChange={(e) => setSchoolWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
            <Button variant="secondary">Reset to Default</Button>
            <Button variant="primary" onClick={saveProfile}>
              Save School Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
