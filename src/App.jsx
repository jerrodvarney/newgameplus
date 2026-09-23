import GamePage from '@/pages/game/GamePage';
import SetupPage from '@/pages/setup/SetupPage';
import UnmatchedPage from '@/pages/unmatched/UnmatchedPage';
import { Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/unmatched" replace />} />
      <Route path="/unmatched" element={<UnmatchedPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/game" element={<GamePage />} />

      {/* NON-EXISTENT ENDPOINT REDIRECT */}
      <Route path="*" element={<Navigate to="/unmatched" replace />} />
    </Routes>
  );
}
