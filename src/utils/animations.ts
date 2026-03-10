import type { Variants } from 'framer-motion';

// Material Design Easing
export const EASING: Record<string, [number, number, number, number]> = {
  standard: [0.4, 0.0, 0.2, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
};

// Modal Animations (Backdrop + Content)
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: EASING.accelerate }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASING.decelerate }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: EASING.accelerate }
  }
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

// List Item Animations
export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: EASING.decelerate }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2, ease: EASING.accelerate } 
  }
};

// Page/Section Transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASING.standard } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2, ease: EASING.standard } }
};

// Spring configuration for layout animations
export const springLayout = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1
};
