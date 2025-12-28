import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import './Onboarding.css';

const GRADES = [
  { value: 'ג', label: 'כיתה ג׳' },
  { value: 'ד', label: 'כיתה ד׳' },
  { value: 'ה', label: 'כיתה ה׳' },
  { value: 'ו', label: 'כיתה ו׳' },
  { value: 'ז', label: 'כיתה ז׳' },
  { value: 'ח', label: 'כיתה ח׳' },
  { value: 'ט', label: 'כיתה ט׳' },
];

const DIFFICULTIES = [
  { value: 'reading_comprehension', label: 'הבנת הנקרא', icon: '📖' },
  { value: 'writing', label: 'כתיבה והבעה', icon: '✏️' },
  { value: 'focus', label: 'ריכוז וקשב', icon: '🎯' },
  { value: 'organization', label: 'ארגון וסדר', icon: '📋' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setStudent, setToken } = useAppStore();
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    difficulty: '',
    parentEmail: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0 && !formData.name.trim()) {
      newErrors.name = 'נא להזין שם';
    }
    if (step === 1 && !formData.grade) {
      newErrors.grade = 'נא לבחור כיתה';
    }
    if (step === 2 && !formData.difficulty) {
      newErrors.difficulty = 'נא לבחור מוקד';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setStudent({
        name: formData.name.trim(),
        grade: formData.grade,
        difficulty: formData.difficulty,
        parentEmail: formData.parentEmail.trim(),
        createdAt: new Date().toISOString()
      });
      
      // Generate a simple token (in production, this would come from backend)
      setToken(`token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      
      navigate('/lesson');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="name"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="onboarding-step"
          >
            <div className="step-icon">👋</div>
            <h2>שלום! מה השם שלך?</h2>
            <p className="step-subtitle">נשמח להכיר אותך</p>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הקלד/י את שמך..."
              className={`onboarding-input ${errors.name ? 'error' : ''}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div
            key="grade"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="onboarding-step"
          >
            <div className="step-icon">📚</div>
            <h2>היי {formData.name}! באיזו כיתה את/ה?</h2>
            <div className="grade-grid">
              {GRADES.map((grade) => (
                <button
                  key={grade.value}
                  className={`grade-button ${formData.grade === grade.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, grade: grade.value })}
                >
                  {grade.label}
                </button>
              ))}
            </div>
            {errors.grade && <span className="error-text">{errors.grade}</span>}
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="difficulty"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="onboarding-step"
          >
            <div className="step-icon">🎯</div>
            <h2>במה נתמקד יחד?</h2>
            <p className="step-subtitle">בחר/י את האתגר העיקרי</p>
            <div className="difficulty-grid">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  className={`difficulty-button ${formData.difficulty === diff.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                >
                  <span className="diff-icon">{diff.icon}</span>
                  <span className="diff-label">{diff.label}</span>
                </button>
              ))}
            </div>
            {errors.difficulty && <span className="error-text">{errors.difficulty}</span>}
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="parent"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="onboarding-step"
          >
            <div className="step-icon">👨‍👩‍👧</div>
            <h2>אימייל של ההורים (אופציונלי)</h2>
            <p className="step-subtitle">לצורך שליחת דוחות התקדמות</p>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              placeholder="parent@email.com"
              className="onboarding-input"
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
            <p className="optional-note">* ניתן לדלג על שלב זה</p>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
      </div>
      
      <div className="onboarding-content">
        <div className="progress-dots">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={step}>
          {renderStep()}
        </AnimatePresence>

        <div className="onboarding-buttons">
          {step > 0 && (
            <button className="btn-back" onClick={handleBack}>
              חזרה
            </button>
          )}
          <button className="btn-next" onClick={handleNext}>
            {step === 3 ? 'בואו נתחיל! 🚀' : 'המשך'}
          </button>
        </div>
      </div>
    </div>
  );
}

