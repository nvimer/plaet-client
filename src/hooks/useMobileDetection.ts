import { useEffect } from 'react';
import { useUIStore } from '@/stores/useUIStore';

/**
 * useMobileDetection Hook
 * 
 * Automatically detects window resizes and updates the UI store's isMobile state.
 * Breakpoint is set to 1024px (Tailwind 'lg' breakpoint).
 */
export function useMobileDetection() {
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    // Setup listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);
}
