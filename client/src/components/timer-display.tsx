import { motion } from "framer-motion";

interface TimerDisplayProps {
  seconds: number;
  total: number;
}

export function TimerDisplay({ seconds, total }: TimerDisplayProps) {
  const progress = ((total - seconds) / total) * 100;
  
  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      {/* Background Circle Track */}
      <svg className="absolute w-80 h-80 -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/10"
        />
        {/* Progress Circle */}
        <motion.circle
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1, ease: "linear" }}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>

      {/* Number Display */}
      <motion.div 
        key={seconds}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-[8rem] font-bold font-timer text-primary leading-none tracking-tighter z-10"
      >
        {seconds}
      </motion.div>
      <span className="text-primary/60 font-medium uppercase tracking-widest mt-4">Seconds</span>
    </div>
  );
}
