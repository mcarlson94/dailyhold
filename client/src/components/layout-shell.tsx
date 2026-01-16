import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
  variant?: "default" | "minimal";
}

export function LayoutShell({ children, variant = "default" }: LayoutShellProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />


      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-2 text-center text-xs text-primary/40 pb-safe shrink-0">
        © {new Date().getFullYear()} DailyHold.co
      </footer>
    </div>
  );
}
