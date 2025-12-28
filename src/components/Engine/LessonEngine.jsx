import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore, injectVariables } from '../../store/useAppStore';
import unitData from '../../data/unit_01.json';

import ProgressBar from './ProgressBar';
import MentorBridge from './steps/MentorBridge';
import SilentLogger from './steps/SilentLogger';
import ActiveAssembly from './steps/ActiveAssembly';
import ClosingProtocol from './steps/ClosingProtocol';

import './LessonEngine.css';

export default function LessonEngine() {
  const navigate = useNavigate();
  const { 
    student, 
    token,
    currentStepIndex, 
    setCurrentUnit,
    resetProgress
  } = useAppStore();

  // Check auth
  useEffect(() => {
    if (!token || !student) {
      navigate('/');
    }
  }, [token, student, navigate]);

  // Load unit data
  useEffect(() => {
    setCurrentUnit(unitData);
    resetProgress();
  }, [setCurrentUnit, resetProgress]);

  const sequence = unitData.sequence;
  const currentStep = sequence[currentStepIndex];
  const totalSteps = sequence.length;

  // Inject student variables into step data
  const processedStep = useMemo(() => {
    if (!currentStep || !student) return currentStep;

    const processValue = (value) => {
      if (typeof value === 'string') {
        return injectVariables(value, student);
      }
      if (Array.isArray(value)) {
        return value.map(processValue);
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, processValue(v)])
        );
      }
      return value;
    };

    return processValue(currentStep);
  }, [currentStep, student]);

  const renderStep = () => {
    if (!processedStep) return null;

    const props = {
      step: processedStep,
      stepIndex: currentStepIndex,
      totalSteps
    };

    switch (processedStep.mode) {
      case 'MENTOR_BRIDGE':
        return <MentorBridge key={processedStep.id} {...props} />;
      case 'SILENT_LOGGER':
        return <SilentLogger key={processedStep.id} {...props} />;
      case 'ACTIVE_ASSEMBLY':
        return <ActiveAssembly key={processedStep.id} {...props} />;
      case 'CLOSING_PROTOCOL':
        return <ClosingProtocol key={processedStep.id} {...props} />;
      default:
        return <div>Unknown step mode: {processedStep.mode}</div>;
    }
  };

  if (!student || !token) {
    return null;
  }

  return (
    <div className="lesson-container">
      <div className="lesson-background">
        <div className="bg-gradient" />
        <div className="bg-pattern" />
      </div>

      <div className="lesson-header">
        <ProgressBar current={currentStepIndex + 1} total={totalSteps} />
        <div className="unit-title">{unitData.unit_metadata.title}</div>
      </div>

      <div className="lesson-content">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}

