import { useState, useEffect, useCallback, useRef } from 'react';
import { differenceInSeconds, startOfTomorrow, isSameDay, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';
import { useWakeLock } from './use-wake-lock';

const STORAGE_KEY = 'dailyHold_lastCompleted';
const DURATION = 60; // seconds

export type TimerStatus = 'idle' | 'running' | 'completed' | 'already-completed';

export function useTimerLogic() {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  
  // Ref to track timeLeft inside interval without recreating it
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  // Check initial state from local storage
  useEffect(() => {
    try {
      const storedDate = localStorage.getItem(STORAGE_KEY);
      if (storedDate) {
        const date = parseISO(storedDate);
        if (isSameDay(date, new Date())) {
          setStatus('already-completed');
          setCompletionDate(date);
        }
      }
    } catch {
      // localStorage not available (Safari private browsing) - continue without stored state
    }
  }, []);

  // Define handleComplete before using it in useEffect
  const handleComplete = useCallback(() => {
    // Release wake lock in background (non-blocking)
    releaseWakeLock();
    
    // Update UI state first
    setStatus('completed');
    
    // Defer heavy operations to next frame so UI updates first
    requestAnimationFrame(() => {
      const now = new Date();
      try {
        localStorage.setItem(STORAGE_KEY, now.toISOString());
      } catch {
        // localStorage not available (Safari private browsing) - continue without saving
      }
      setCompletionDate(now);
      
      // Trigger celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d5446', '#ffffff', '#3e6b5a'],
        disableForReducedMotion: true
      });
    });
  }, [releaseWakeLock]);

  // Timer tick logic - only depends on status, reads timeLeft from ref
  useEffect(() => {
    if (status !== 'running') return;
    
    const interval = window.setInterval(() => {
      const current = timeLeftRef.current;
      if (current <= 1) {
        // Timer complete
        window.clearInterval(interval);
        setTimeLeft(0);
        handleComplete();
      } else {
        setTimeLeft(current - 1);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status, handleComplete]);

  const handleStart = async () => {
    await requestWakeLock();
    setStatus('running');
    setTimeLeft(DURATION);
  };

  const handleGiveUp = async () => {
    await releaseWakeLock();
    setStatus('idle');
    setTimeLeft(DURATION);
  };

  const handleResetForDemo = () => {
    // Hidden dev feature or "close modal" action essentially
    // But logically, if it's completed today, we stay in 'already-completed' state visually usually
    // For this app flow, closing the modal goes to "already-completed" view
    setStatus('already-completed');
  };

  return {
    status,
    timeLeft,
    completionDate,
    handleStart,
    handleGiveUp,
    handleCloseModal: handleResetForDemo
  };
}

export function useNextMidnightCountdown() {
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = startOfTomorrow();
      const diffSeconds = differenceInSeconds(tomorrow, now);
      
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeUntilReset(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeUntilReset;
}
