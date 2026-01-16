import { ReactNode } from "react";
import logoImg from "@assets/ChatGPT_Image_Jan_15,_2026,_07_30_19_PM_1768523514876.png";

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

      {/* Header */}
      <header className={`w-full p-6 flex justify-center z-10 ${variant === 'minimal' ? 'opacity-80 scale-90' : ''} transition-all duration-500`}>
        <img 
          src={logoImg} 
          alt="DailyHold Logo" 
          className="h-12 w-auto object-contain drop-shadow-sm" 
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 relative z-10 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center text-xs text-primary/40 pb-safe">
        © {new Date().getFullYear()} DailyHold.co
      </footer>
    </div>
  );
}
