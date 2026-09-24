import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen"
      style={{ background: 'var(--app-bg)', color: 'var(--app-text)' }}
    >
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </motion.div>
  );
}
