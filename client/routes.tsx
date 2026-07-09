import { createRoutesFromElements, Route } from 'react-router'

import App from './components/App.tsx'
import Home from './pages/Home.tsx'
import Reading from './pages/Reading.tsx'
import Writing from './pages/Writing.tsx'
import Maths from './pages/Maths.tsx'
import Discovery from './pages/Discovery.tsx'
import Character from './pages/Character.tsx'
import Rewards from './pages/Rewards.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="reading" element={<Reading />} />
    <Route path="writing" element={<Writing />} />
    <Route path="maths" element={<Maths />} />
    <Route path="discovery" element={<Discovery />} />
    <Route path="character" element={<Character />} />
    <Route path="rewards" element={<Rewards />} />
  </Route>,
)