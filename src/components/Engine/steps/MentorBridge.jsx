import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import VideoPlayer from '../VideoPlayer';

export default function MentorBridge({ step }) {
  const { nextStep, addLog } = useAppStore();

  const handleContinue = () => {
    addLog({
      stepId: step.id,
      action: 'mentor_bridge_complete',
      log_tag: 'viewed_intro'
    });
    nextStep();
  };

  return (
    <motion.div
      className="step-card mentor-bridge"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {step.title && <h2 className="step-title">{step.title}</h2>}
      
      {step.description && (
        <p className="step-instruction">{step.description}</p>
      )}

      {step.media_type === 'video' && (
        <VideoPlayer 
          videoId={step.video_id} 
          provider={step.video_provider} 
        />
      )}

      {step.action_text && (
        <p className="mentor-action-text">{step.action_text}</p>
      )}

      <button className="continue-button" onClick={handleContinue}>
        {step.next_button_text || 'המשך'}
      </button>
    </motion.div>
  );
}

