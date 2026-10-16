import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ZoodiLogo } from './ZoodiLogo';

export const AppOpenAnimation: React.FC = () => {
  const { isOpenAnimationActive, dismissOpenAnimation } = useApp();
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isOpenAnimationActive) return;

    // 1. Logo "coming in" entrance animation when opened
    const enterTimer = setTimeout(() => {
      setHasEntered(true);
    }, 60);

    // 2. Hold, then start the slow 2-second blur transition into home
    const exitTimer = setTimeout(() => {
      startExit();
    }, 1800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [isOpenAnimationActive]);

  const startExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    // 2-second slow cinematic blur fade into home
    setTimeout(() => {
      dismissOpenAnimation();
      setIsExiting(false);
      setHasEntered(false);
    }, 2000);
  };

  if (!isOpenAnimationActive) return null;

  return (
    <div
      role="dialog"
      aria-label="App Launching"
      onClick={startExit}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#dcf0ef] dark:bg-slate-950 cursor-pointer select-none transition-all duration-[2000ms] ease-out ${
        isExiting
          ? 'opacity-0 backdrop-blur-2xl pointer-events-none scale-105'
          : 'opacity-100 backdrop-blur-none scale-100'
      }`}
      style={{
        backdropFilter: isExiting ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: isExiting ? 'blur(24px)' : 'none',
      }}
    >
      {/* Centered shop logo: smooth incoming animation on open, slow 2-second blur on exit */}
      <div
        className={`flex flex-col items-center justify-center p-6 transform transition-all ease-out ${
          isExiting
            ? 'duration-[2000ms] opacity-0 blur-xl scale-110 -translate-y-2'
            : hasEntered
            ? 'duration-1000 opacity-100 blur-0 scale-100 translate-y-0'
            : 'duration-0 opacity-0 blur-md scale-75 translate-y-8'
        }`}
      >
        <ZoodiLogo variant="stacked" size="splash" />
      </div>
    </div>
  );
};
