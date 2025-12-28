import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import './ParentView.css';

export default function ParentView() {
  const navigate = useNavigate();
  const { student, logs, completedUnits } = useAppStore();

  // Group logs by step and analyze patterns
  const analyzeProgress = () => {
    const stepLogs = {};
    const focusAreas = [];

    logs.forEach(log => {
      if (!stepLogs[log.stepId]) {
        stepLogs[log.stepId] = [];
      }
      stepLogs[log.stepId].push(log);

      // Identify focus areas based on log tags
      if (log.log_tag?.includes('confuses_fact')) {
        if (!focusAreas.find(f => f.type === 'fact_confusion')) {
          focusAreas.push({
            type: 'fact_confusion',
            label: 'הבחנה בין עובדה לטענה',
            icon: '📋',
            description: 'התלמיד/ה מתקשה להבחין בין עובדות לבין טענות'
          });
        }
      }
      if (log.log_tag?.includes('confuses_topic')) {
        if (!focusAreas.find(f => f.type === 'topic_confusion')) {
          focusAreas.push({
            type: 'topic_confusion',
            label: 'זיהוי נושא מרכזי',
            icon: '🎯',
            description: 'יש קושי בזיהוי הנושא המרכזי לעומת הטענה'
          });
        }
      }
      if (log.log_tag?.includes('assembly_error')) {
        if (!focusAreas.find(f => f.type === 'assembly')) {
          focusAreas.push({
            type: 'assembly',
            label: 'הרכבת מושגים',
            icon: '🧩',
            description: 'נדרש תרגול נוסף בהבנת מבנה הטענה'
          });
        }
      }
    });

    return { stepLogs, focusAreas };
  };

  const { focusAreas } = analyzeProgress();

  // Calculate statistics
  const totalAttempts = logs.filter(l => l.action === 'option_selected' || l.action === 'assembly_check').length;
  const successAttempts = logs.filter(l => l.log_tag === 'success' || l.action === 'unit_complete').length;
  const successRate = totalAttempts > 0 ? Math.round((successAttempts / totalAttempts) * 100) : 0;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="parent-view-container">
      <div className="parent-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
      </div>

      <motion.div
        className="parent-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="parent-header">
          <h1>👨‍👩‍👧 מסך הורים</h1>
          <p>סיכום התקדמות ומיקודים</p>
        </div>

        {/* Student Info Card */}
        {student && (
          <motion.div
            className="info-card student-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="student-avatar">
              {student.name?.charAt(0) || '👤'}
            </div>
            <div className="student-details">
              <h2>{student.name}</h2>
              <p>כיתה {student.grade}</p>
              <p className="student-since">הצטרף/ה: {formatDate(student.createdAt)}</p>
            </div>
          </motion.div>
        )}

        {/* Progress Stats */}
        <motion.div
          className="info-card stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>סטטיסטיקות</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{completedUnits.length}</div>
              <div className="stat-label">יחידות הושלמו</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalAttempts}</div>
              <div className="stat-label">ניסיונות</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{successRate}%</div>
              <div className="stat-label">הצלחה</div>
            </div>
          </div>
        </motion.div>

        {/* Focus Areas */}
        <motion.div
          className="info-card focus-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>🎯 נקודות למיקוד</h3>
          {focusAreas.length > 0 ? (
            <div className="focus-list">
              {focusAreas.map((area, index) => (
                <div key={area.type} className="focus-item">
                  <span className="focus-icon">{area.icon}</span>
                  <div className="focus-content">
                    <strong>{area.label}</strong>
                    <p>{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-focus">
              <span className="no-focus-icon">✨</span>
              <p>אין נקודות למיקוד מיוחדות כרגע!</p>
              <p className="no-focus-sub">התלמיד/ה מתקדם/ת יפה</p>
            </div>
          )}
        </motion.div>

        {/* Activity Log */}
        <motion.div
          className="info-card log-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>📝 פעילות אחרונה</h3>
          {logs.length > 0 ? (
            <div className="log-list">
              {logs.slice(-10).reverse().map((log, index) => (
                <div key={index} className="log-item">
                  <span className={`log-badge ${log.log_tag === 'success' || log.action === 'unit_complete' ? 'success' : ''}`}>
                    {log.log_tag === 'success' ? '✓' : log.action === 'unit_complete' ? '🏆' : '•'}
                  </span>
                  <div className="log-content">
                    <span className="log-action">
                      {log.action === 'option_selected' && 'בחירת תשובה'}
                      {log.action === 'assembly_check' && 'בדיקת תרגיל'}
                      {log.action === 'unit_complete' && 'סיום יחידה'}
                      {log.action === 'mentor_bridge_complete' && 'צפייה בסרטון'}
                    </span>
                    <span className="log-time">{formatDate(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-logs">אין פעילות עדיין</p>
          )}
        </motion.div>

        <button className="back-button" onClick={() => navigate('/')}>
          חזרה לדף הבית
        </button>
      </motion.div>
    </div>
  );
}

