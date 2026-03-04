/**
 * SOFT & MINIMAL MOTION CONFIGURATIONS
 * 
 * Standardized animations for a premium, elegant feel.
 * - Duration: 0.4s (Optimal for perceived speed and smoothness)
 * - Ease: [0.22, 1, 0.36, 1] (Custom Cubic Bezier for natural deceleration)
 * - Offsets: 8px (Subtle enough to be elegant, large enough to be seen)
 */

export const softSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const softBezier = [0.22, 1, 0.36, 1];

export const transitions = {
  soft: { duration: 0.4, ease: softBezier },
  fast: { duration: 0.2, ease: softBezier },
  stagger: (delay = 0.05) => ({
    animate: {
      transition: {
        staggerChildren: delay
      }
    }
  })
};

export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: transitions.soft },
    exit: { opacity: 0, transition: transitions.fast }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: transitions.soft },
    exit: { opacity: 0, y: -4, transition: transitions.fast }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0, transition: transitions.soft },
    exit: { opacity: 0, x: -4, transition: transitions.fast }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: transitions.soft },
    exit: { opacity: 0, scale: 0.98, transition: transitions.fast }
  },
  modalEntry: {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: transitions.soft },
    exit: { opacity: 0, scale: 0.98, y: 10, transition: transitions.fast }
  }
};
