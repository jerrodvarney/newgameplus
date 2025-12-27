import Game from '@/pages/game/Game';
import Setup from '@/pages/setup/Setup';
import UnmatchedPage from '@/pages/unmatched/UnmatchedPage';
import { Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/unmatched" replace />} />
      <Route path="/unmatched" element={<UnmatchedPage />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/game" element={<Game />} />

      {/* NON-EXISTENT ENDPOINT REDIRECT */}
      <Route path="*" element={<Navigate to="/unmatched" replace />} />
    </Routes>
  );
}
