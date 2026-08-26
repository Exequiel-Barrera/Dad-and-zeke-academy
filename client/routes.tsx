import { createRoutesFromElements, Route } from 'react-router'

import Layout from './components/layout/Layout.tsx'
import Home from './pages/Home.tsx'
import Reading from './pages/Reading.tsx'
import Writing from './pages/Writing.tsx'
import Maths from './pages/Maths.tsx'
import Discovery from './pages/Discovery.tsx'
import Character from './pages/Character.tsx'
import Rewards from './pages/Rewards.tsx'
import ReadingMission from './pages/ReadingMission.tsx'
import WritingMission from './pages/WritingMission'
import DadDashboard from './pages/DadDashboard'

export default createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
<Route
  path="dad-dashboard"
  element={<DadDashboard />}
/>
    <Route path="reading" element={<Reading />} />

    <Route
      path="reading/mission/:missionId"
      element={<ReadingMission />}
    />

    <Route path="writing" element={<Writing />} />

    <Route
      path="writing/mission/:missionId"
      element={<WritingMission />}
    />

    <Route path="maths" element={<Maths />} />
    <Route path="discovery" element={<Discovery />} />
    <Route path="character" element={<Character />} />
    <Route path="rewards" element={<Rewards />} />
  </Route>,
)