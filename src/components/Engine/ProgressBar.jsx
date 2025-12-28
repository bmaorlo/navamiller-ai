import { motion } from 'framer-motion';
import './ProgressBar.css';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-info">
        <span className="progress-text">שלב {current} מתוך {total}</span>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="progress-glow" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-steps">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < current ? 'completed' : ''} ${i === current - 1 ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

