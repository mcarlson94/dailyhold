import { motion, AnimatePresence } from "framer-motion";
import { Play, XCircle } from "lucide-react";
import { useTimerLogic, useNextMidnightCountdown } from "@/hooks/use-timer-logic";
import { LayoutShell } from "@/components/layout-shell";
import { TimerDisplay } from "@/components/timer-display";
import { CompletionModal } from "@/components/completion-modal";
import logoUrl from "@assets/ParentPresents_Best_Logo_(1)_1768523932340.png";

export default function Home() {
  const { 
    status, 
    timeLeft, 
    completionDate, 
    handleStart, 
    handleGiveUp, 
    handleCloseModal 
  } = useTimerLogic();

  const nextHoldCountdown = useNextMidnightCountdown();

  // If already completed today and closed modal, show simple completed state
  if (status === 'already-completed') {
    return (
      <LayoutShell>
        <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in duration-700">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/5">
            <div className="text-6xl">✅</div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-primary">Great Job!</h1>
            <p className="text-lg text-primary/60 max-w-[250px] mx-auto">
              You've completed your hold for today.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-white p-6 rounded-2xl w-full max-w-xs shadow-sm">
            <p className="text-xs uppercase tracking-widest text-primary/40 font-bold mb-2">Next hold available in</p>
            <p className="font-mono text-3xl font-medium text-primary tracking-wider">{nextHoldCountdown}</p>
          </div>
        </div>
      </LayoutShell>
    );
  }

  return (
    <>
      <LayoutShell variant={status === 'running' ? 'minimal' : 'default'}>
        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-12 w-full"
            >
              <div className="text-center space-y-4 flex flex-col items-center">
                <img src={logoUrl} alt="Daily Hold" className="w-64 md:w-80 object-contain" />
                <p className="text-xl text-primary/60 font-medium">
                  One minute. Every day.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={handleStart}
                  className="relative px-12 py-6 bg-primary text-white rounded-full text-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 flex items-center gap-3 w-full min-w-[200px] justify-center"
                >
                  <Play className="w-6 h-6 fill-current" />
                  START
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <motion.img 
                src={logoUrl}
                alt="Daily Hold"
                className="w-32 mb-4 opacity-80"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.8, y: 0 }}
              />

              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-display font-medium text-primary/80 relative z-20 mb-2"
              >
                Hold...
              </motion.p>
              
              <TimerDisplay seconds={timeLeft} total={60} />
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={handleGiveUp}
                className="mt-4 flex items-center gap-2 px-6 py-2 rounded-xl text-primary/50 hover:text-destructive hover:bg-destructive/5 transition-colors text-sm font-medium tracking-wide uppercase"
              >
                <XCircle className="w-5 h-5" />
                Give Up
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutShell>

      <CompletionModal 
        isOpen={status === 'completed'} 
        onClose={handleCloseModal}
        date={completionDate}
      />
    </>
  );
}
