import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal: Animates elements upward smoothly as user scrolls down the page
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  yOffset = 36,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic bezier easing
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer: Parent container for sequential stagger reveal of child items
 */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  ...props
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem: Child item that glides upward when parent enters viewport
 */
export function StaggerItem({
  children,
  className = '',
  yOffset = 32,
  duration = 0.55,
  ...props
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
