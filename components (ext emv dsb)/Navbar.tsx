import { Bell, Menu, User } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-card border-b border-border shadow-sm z-30 flex items-center justify-between px-6">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page Title - Hidden on mobile */}
      <div className="hidden md:block">
        <h1 className="text-card-foreground">Content Management System</h1>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-card-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">School Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
