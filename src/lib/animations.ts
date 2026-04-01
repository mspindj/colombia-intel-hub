import type { Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

export const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

export const staggerContainer = (delay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});

export const fadeUpItem = (duration = 0.5): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease },
  },
});

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease, delay: 0.2 },
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease, delay: 0.3 },
  },
};

export const viewportOnce = { once: true, amount: 0.15 } as const;
