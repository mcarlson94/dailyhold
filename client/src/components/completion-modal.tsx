import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Check } from "lucide-react";
import { format } from "date-fns";
import { useNextMidnightCountdown } from "@/hooks/use-timer-logic";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
}

export function CompletionModal({ isOpen, onClose, date }: CompletionModalProps) {
  const countdown = useNextMidnightCountdown();
  const formattedDate = date ? format(date, "M/d") : "";

  const handleShare = async () => {
    const text = `DailyHold ${formattedDate}\n✅`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DailyHold',
          text: text,
          url: 'https://www.dailyhold.co'
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm bg-primary text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Success Icon BG */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">DailyHold</h2>
                <div className="inline-flex items-center justify-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full">
                  <span className="text-sm font-medium tracking-wide">{formattedDate}</span>
                </div>
              </div>

              {/* Big Check */}
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary shadow-lg shadow-black/20"
              >
                <Check className="w-12 h-12 stroke-[4]" />
              </motion.div>

              <p className="text-white/80 text-lg leading-relaxed font-medium">
                You've completed your<br/>daily minute hold.
              </p>

              <div className="w-full pt-4 space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-lg hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <Share2 className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  Share Result
                </button>

                <p className="text-white/60 text-sm">
                  Share to encourage your friends!
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10" />

              {/* Countdown Footer */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-white/50 font-bold">New hold in</p>
                <p className="font-mono text-2xl font-medium tracking-wider">{countdown}</p>
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
