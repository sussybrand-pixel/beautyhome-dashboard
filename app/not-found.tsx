import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-primary">Page not found</h1>
        <p className="text-muted-foreground">Return to dashboard or login.</p>
        <div className="space-x-2">
          <Link href="/dashboard" className="text-primary underline">Dashboard</Link>
          <Link href="/login" className="text-primary underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
