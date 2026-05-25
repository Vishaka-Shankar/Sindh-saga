import React, { createContext, useContext, useState, useEffect } from 'react';

type LoadingContextType = {
  loading: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  simulateAPILoad: (duration?: number) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  progress: 0,
  startLoading: () => {},
  stopLoading: () => {},
  simulateAPILoad: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      setProgress(0.1); // Start at 10%
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 0.85) {
            return prev; // Hold at 85% until finished
          }
          // Incrementally slow down
          const increment = (0.9 - prev) * 0.15;
          return prev + increment;
        });
      }, 150);
    } else {
      if (progress > 0) {
        setProgress(1); // Jump to 100%
        const timeout = setTimeout(() => {
          setProgress(0); // Reset
        }, 300);
        return () => clearTimeout(timeout);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const simulateAPILoad = (duration = 1000) => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, duration);
  };

  return (
    <LoadingContext.Provider value={{ loading, progress, startLoading, stopLoading, simulateAPILoad }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
