import { useState } from 'react'
import TabBar from './ui/TabBar'
import HomeDashboard from './home/HomeDashboard'
import ScheduleScreen from './schedule/ScheduleScreen'
import CalendarScreen from './calendar/CalendarScreen'
import PantryScreen from './pantry/PantryScreen'
import ProfileScreen from './profile/ProfileScreen'

const TAB_BACKGROUND = {
  home: 'var(--color-accent-2-300)',
  schedule: 'var(--color-bg)',
  calendar: 'var(--color-bg)',
  pantry: 'var(--color-bg)',
  profile: 'var(--color-bg)',
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="screen-viewport">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <main
        id="main-content"
        className="screen-main"
        style={{
          background: TAB_BACKGROUND[activeTab],
          paddingTop: 'max(var(--space-3), env(safe-area-inset-top))',
          paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
        }}
      >
        <div key={activeTab} className="page-transition" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
          {activeTab === 'home' && <HomeDashboard onNavigateToSchedule={() => setActiveTab('schedule')} />}
          {activeTab === 'schedule' && <ScheduleScreen />}
          {activeTab === 'calendar' && <CalendarScreen />}
          {activeTab === 'pantry' && <PantryScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>
      </main>
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default MainApp
