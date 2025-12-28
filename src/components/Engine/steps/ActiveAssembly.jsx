import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import VideoPlayer from '../VideoPlayer';
import './ActiveAssembly.css';

export default function ActiveAssembly({ step }) {
  const {
    nextStep,
    addLog,
    incrementAttempt,
    getAttempts,
    showRefinement,
    setShowRefinement
  } = useAppStore();

  const [answers, setAnswers] = useState({});
  const [draggedWord, setDraggedWord] = useState(null);
  const [allCorrect, setAllCorrect] = useState(false);
  const [showErrors, setShowErrors] = useState({});

  // Reset state when step changes
  useEffect(() => {
    setAnswers({});
    setDraggedWord(null);
    setAllCorrect(false);
    setShowErrors({});
    setShowRefinement(false);
  }, [step.id, setShowRefinement]);

  // Get all available words from all slots
  const allWords = step.slots.flatMap(slot => slot.options || []);
  const usedWords = Object.values(answers);
  const availableWords = allWords.filter(word => !usedWords.includes(word));

  const handleDragStart = (word) => {
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDropOnSlot = (slotId) => {
    if (draggedWord) {
      setAnswers(prev => ({
        ...prev,
        [slotId]: draggedWord
      }));
      setDraggedWord(null);
      setShowErrors(prev => ({ ...prev, [slotId]: false }));
    }
  };

  const handleWordClick = (word) => {
    // Find first empty slot
    const emptySlot = step.slots.find(slot => !answers[slot.id]);
    if (emptySlot) {
      setAnswers(prev => ({
        ...prev,
        [emptySlot.id]: word
      }));
      setShowErrors(prev => ({ ...prev, [emptySlot.id]: false }));
    }
  };

  const handleSlotClick = (slotId) => {
    // Remove word from slot
    if (answers[slotId]) {
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[slotId];
        return newAnswers;
      });
    }
  };

  const handleCheck = () => {
    incrementAttempt(step.id);

    // Check all answers
    const errors = {};
    let correct = true;

    step.slots.forEach(slot => {
      const userAnswer = answers[slot.id];
      if (userAnswer !== slot.correct) {
        errors[slot.id] = true;
        correct = false;
      }
    });

    setShowErrors(errors);

    addLog({
      stepId: step.id,
      action: 'assembly_check',
      answers,
      correct,
      log_tag: correct ? 'success' : 'assembly_error'
    });

    if (correct) {
      setAllCorrect(true);
    } else {
      const attempts = getAttempts(step.id);
      const triggerAttempts = step.refinement_loop?.trigger === '2_attempts' ? 2 : 3;

      if (attempts >= triggerAttempts && step.refinement_loop) {
        setTimeout(() => {
          setShowRefinement(true);
        }, 500);
      }
    }
  };

  const handleCloseRefinement = () => {
    setShowRefinement(false);
    setAnswers({});
    setShowErrors({});
  };

  const handleContinue = () => {
    nextStep();
  };

  const allSlotsFilled = step.slots.every(slot => answers[slot.id]);

  return (
    <>
      <motion.div
        className="step-card active-assembly"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        {step.title && <h2 className="step-title">{step.title}</h2>}

        {step.instruction && (
          <p className="step-instruction">{step.instruction}</p>
        )}

        {step.formula_visual && (
          <div className="formula-display">
            <span className="formula-text">{step.formula_visual}</span>
          </div>
        )}

        <div className="slots-container">
          {step.slots.map((slot, index) => (
            <motion.div
              key={slot.id}
              className="slot-row"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="slot-context">
                {slot.context.split('____').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        className={`slot-blank ${answers[slot.id] ? 'filled' : ''} ${showErrors[slot.id] ? 'error' : ''} ${allCorrect ? 'correct' : ''}`}
                        onClick={() => handleSlotClick(slot.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnSlot(slot.id)}
                      >
                        {answers[slot.id] || '____'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {!allCorrect && (
          <div className="word-bank">
            <p className="word-bank-label">גרור/י את המילים למקומן:</p>
            <div className="words-container">
              {availableWords.map((word, index) => (
                <motion.div
                  key={word}
                  className="draggable-word"
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleWordClick(word)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {allCorrect && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <span className="success-icon">🎉</span>
              <span className="success-text">
                {step.success_message || 'מצוין! כל התשובות נכונות!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!allCorrect && (
          <button
            className="continue-button check-button"
            onClick={handleCheck}
            disabled={!allSlotsFilled}
          >
            בדוק
          </button>
        )}

        {allCorrect && (
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
                <h3>הנה עזרה קטנה</h3>
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

