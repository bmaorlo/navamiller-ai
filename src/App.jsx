import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Onboarding from './components/Onboarding/Onboarding';
import LessonEngine from './components/Engine/LessonEngine';
import ParentView from './components/ParentView/ParentView';

// Protected Route component
function ProtectedRoute({ children }) {
  const { token, student } = useAppStore();
  
  if (!token || !student) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route 
          path="/lesson" 
          element={
            <ProtectedRoute>
              <LessonEngine />
            </ProtectedRoute>
          } 
        />
        <Route path="/parent" element={<ParentView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
