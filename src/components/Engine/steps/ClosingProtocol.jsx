import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import VideoPlayer from '../VideoPlayer';
import './ClosingProtocol.css';

export default function ClosingProtocol({ step }) {
  const navigate = useNavigate();
  const { addLog, markUnitComplete, currentUnit } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Log completion
    addLog({
      stepId: step.id,
      action: 'unit_complete',
      log_tag: 'completed'
    });

    // Mark unit as complete
    if (currentUnit?.unit_metadata?.id) {
      markUnitComplete(currentUnit.unit_metadata.id);
    }

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [step.id, addLog, markUnitComplete, currentUnit]);

  const handleNextUnit = () => {
    // In a real app, this would navigate to the next unit
    navigate('/');
  };

  const handleParentView = () => {
    navigate('/parent');
  };

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#667eea', '#764ba2', '#f093fb', '#4ade80', '#fbbf24', '#f5576c'][Math.floor(Math.random() * 6)]
  }));

  return (
    <motion.div
      className="step-card closing-protocol"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="confetti-piece"
              initial={{ 
                top: '-10%',
                left: `${piece.x}%`,
                opacity: 1,
                scale: 1,
                rotate: 0
              }}
              animate={{
                top: '110%',
                opacity: 0,
                scale: 0,
                rotate: 720
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: piece.delay,
                ease: 'easeOut'
              }}
              style={{ backgroundColor: piece.color }}
            />
          ))}
        </div>
      )}

      {step.badge && (
        <motion.div
          className="badge-container"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <div className="badge-icon">{step.badge.icon}</div>
          <div className="badge-name">{step.badge.name}</div>
        </motion.div>
      )}

      <motion.h2
        className="celebration-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {step.celebration_text}
      </motion.h2>

      {step.video_reward_id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <VideoPlayer 
            videoId={step.video_reward_id} 
            provider={step.video_provider} 
          />
        </motion.div>
      )}

      {step.summary_points && (
        <motion.div
          className="summary-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="summary-title">מה למדנו היום:</h3>
          <ul className="summary-list">
            {step.summary_points.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <span className="summary-bullet">✓</span>
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        className="closing-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <button className="continue-button" onClick={handleNextUnit}>
          {step.next_unit_button || 'סיום'}
        </button>
        <button className="parent-view-button" onClick={handleParentView}>
          👨‍👩‍👧 מסך הורים
        </button>
      </motion.div>
    </motion.div>
  );
}

