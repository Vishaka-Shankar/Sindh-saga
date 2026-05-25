import React, { createContext, useContext, useState } from 'react';

type ScrollContextType = {
  scrollY: number;
  setScrollY: (y: number) => void;
  scrolled: boolean;
};

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  setScrollY: () => {},
  scrolled: false,
});

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [scrollY, setScrollYState] = useState(0);
  const scrolled = scrollY > 60;

  const setScrollY = (y: number) => {
    setScrollYState(y);
  };

  return (
    <ScrollContext.Provider value={{ scrollY, setScrollY, scrolled }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
