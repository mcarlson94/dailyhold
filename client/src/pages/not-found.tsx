import { Link } from "wouter";
import { LayoutShell } from "@/components/layout-shell";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <LayoutShell>
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-2">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold font-display text-primary">Page Not Found</h1>
        <p className="text-primary/60 max-w-xs">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-colors mt-4 inline-block">
          Return Home
        </Link>
      </div>
    </LayoutShell>
  );
}
