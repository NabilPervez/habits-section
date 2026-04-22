import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function WelcomeScreen({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-gutter)',
        background: 'linear-gradient(180deg, #edfcf2 0%, #ffffff 50%)',
        textAlign: 'center',
      }}
    >
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 260,
          height: 260,
          borderRadius: 32,
          background: 'linear-gradient(145deg, #0d8f3e 0%, #1db954 50%, #24d160 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 48,
          position: 'relative',
          boxShadow: '0 20px 60px rgba(29, 185, 84, 0.3)',
        }}
      >
        {/* Floating orbs */}
        {[
          { size: 16, top: -8, left: 40, delay: 0.5, bg: '#1db954' },
          { size: 12, top: 20, right: -6, delay: 0.7, bg: '#b8f0cc' },
          { size: 20, bottom: 30, left: -10, delay: 0.6, bg: '#1db954' },
          { size: 10, bottom: -5, right: 50, delay: 0.8, bg: '#b8f0cc' },
        ].map((orb, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ delay: orb.delay, type: 'spring' }}
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.bg,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              bottom: orb.bottom,
            }}
          />
        ))}

        {/* Lightning bolt circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Zap size={48} color="#1db954" fill="#1db954" />
        </motion.div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          font: 'var(--text-display)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: 16,
          maxWidth: 340,
        }}
      >
        Build Momentum, One Step at a Time.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        style={{
          font: 'var(--text-body-lg)',
          color: 'var(--color-text-secondary)',
          marginBottom: 64,
        }}
      >
        No sign-ups. No walls. Just flow.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary"
        onClick={onNext}
        id="btn-lets-begin"
        style={{ maxWidth: 360 }}
      >
        Let's Begin
      </motion.button>
    </motion.div>
  );
}
