import Game from '@/pages/game/Game';
import Home from '@/pages/home/Home';
import Setup from '@/pages/setup/Setup';
import Unmatched from '@/pages/unmatched/Unmatched';
import '@/styles/global.scss';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unmatched" element={<Unmatched />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
