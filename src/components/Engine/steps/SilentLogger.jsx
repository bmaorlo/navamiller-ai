import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import VideoPlayer from '../VideoPlayer';

export default function SilentLogger({ step }) {
  const { 
    nextStep, 
    addLog, 
    incrementAttempt, 
    getAttempts,
    showRefinement,
    setShowRefinement
  } = useAppStore();

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Reset state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setIsLocked(false);
    setShowRefinement(false);
  }, [step.id, setShowRefinement]);

  const handleOptionClick = (option) => {
    if (isLocked) return;

    setSelectedOption(option.id);
    incrementAttempt(step.id);

    // Log the attempt
    addLog({
      stepId: step.id,
      action: 'option_selected',
      optionId: option.id,
      log_tag: option.log_tag,
      type: option.type
    });

    const correct = option.type === 'VALID_CLAIM';
    setIsCorrect(correct);

    if (correct) {
      setIsLocked(true);
    } else {
      // Check if refinement is needed
      const attempts = getAttempts(step.id);
      const triggerAttempts = step.refinement_loop?.trigger === '2_attempts' ? 2 : 3;

      if (attempts >= triggerAttempts && step.refinement_loop) {
        // Show refinement video
        setTimeout(() => {
          setShowRefinement(true);
        }, 500);
      } else {
        // Brief visual feedback, then reset for another try
        setTimeout(() => {
          setSelectedOption(null);
        }, 800);
      }
    }
  };

  const handleCloseRefinement = () => {
    setShowRefinement(false);
    setSelectedOption(null);
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <>
      <motion.div
        className="step-card silent-logger"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        {step.title && <h2 className="step-title">{step.title}</h2>}

        {step.question_image && (
          <div className="question-image-container">
            <img 
              src={step.question_image} 
              alt="Question" 
              className="question-image" 
            />
          </div>
        )}

        <p className="step-question">{step.question}</p>

        <div className="options-grid">
          {step.options.map((option, index) => (
            <motion.button
              key={option.id}
              className={`option-button ${selectedOption === option.id ? 'selected' : ''} ${selectedOption === option.id && isCorrect ? 'correct' : ''}`}
              onClick={() => handleOptionClick(option)}
              disabled={isLocked}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
            >
              {option.image_src && (
                <img 
                  src={option.image_src} 
                  alt={option.text} 
                  className="option-image" 
                />
              )}
              <span className="option-text">{option.text}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isCorrect && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <span className="success-icon">✨</span>
              <span className="success-text">
                {step.success_message || 'מצוין! תשובה נכונה!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCorrect && (
          <motion.button
            className="continue-button"
            onClick={handleContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            המשך
          </motion.button>
        )}
      </motion.div>

      {/* Refinement Overlay */}
      <AnimatePresence>
        {showRefinement && step.refinement_loop && (
          <motion.div
            className="refinement-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="refinement-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="refinement-header">
                <span className="refinement-icon">💡</span>
                <h3>בוא ננסה יחד</h3>
              </div>

              {step.refinement_loop.message && (
                <p className="refinement-message">
                  {step.refinement_loop.message}
                </p>
              )}

              {step.refinement_loop.media_type === 'video' && (
                <VideoPlayer
                  videoId={step.refinement_loop.video_id}
                  provider={step.refinement_loop.video_provider}
                  autoplay={true}
                />
              )}

              <button className="continue-button" onClick={handleCloseRefinement}>
                הבנתי, בוא ננסה שוב
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

