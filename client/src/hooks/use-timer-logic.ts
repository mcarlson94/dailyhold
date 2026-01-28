import { useState, useEffect, useCallback } from 'react';
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

  // Check initial state from local storage
  useEffect(() => {
    const storedDate = localStorage.getItem(STORAGE_KEY);
    if (storedDate) {
      const date = parseISO(storedDate);
      if (isSameDay(date, new Date())) {
        setStatus('already-completed');
        setCompletionDate(date);
      }
    }
  }, []);

  // Timer tick logic
  useEffect(() => {
    let interval: number;

    if (status === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (status === 'running' && timeLeft === 0) {
      handleComplete();
    }

    return () => window.clearInterval(interval);
  }, [status, timeLeft]);

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

  const handleComplete = useCallback(() => {
    // Release wake lock in background (non-blocking)
    releaseWakeLock();
    
    const now = new Date();
    localStorage.setItem(STORAGE_KEY, now.toISOString());
    setCompletionDate(now);
    setStatus('completed');
    
    // Trigger celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2d5446', '#ffffff', '#3e6b5a'],
      disableForReducedMotion: true
    });
  }, [releaseWakeLock]);

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
