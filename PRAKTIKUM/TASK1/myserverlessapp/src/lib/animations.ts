import type { Variants } from "framer-motion";

/**
 * Sentral Konfigurasi Animasi Framer Motion
 * Proyek: The Serverless Odyssey
 */

/**
 * Kontainer list/grid dengan animasi staggered cascade
 * Digunakan untuk pembungkus daftar kartu tugas
 */
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Animasi kartu tugas individual dengan efek spring physics dan exit transition
 */
export const taskCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    x: -30,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Animasi backdrop overlay modal (fade-in / fade-out)
 */
export const modalBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

/**
 * Animasi dialog box modal dengan efek pop-in spring dan scale down exit
 */
export const modalDialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

