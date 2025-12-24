import Game from '@/pages/game/Game';
import Setup from '@/pages/setup/Setup';
import Unmatched from '@/pages/unmatched/Unmatched';
import '@/styles/global.scss';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Unmatched />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<Unmatched />} />
    </Routes>
  );
}
