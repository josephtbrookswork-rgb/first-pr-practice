import { useState } from 'react'
import { FamilyProvider } from './context/FamilyContext.jsx'
import AppShell from './components/layout/AppShell.jsx'
import OnboardingFlow from './onboarding/OnboardingFlow.jsx'
import Home from './screens/Home.jsx'
import Chores from './screens/Chores.jsx'
import Calendar from './screens/Calendar.jsx'
import Grocery from './screens/Grocery.jsx'
import Hub from './screens/Hub.jsx'
import { loadProfile, saveProfile } from './lib/profileStorage.js'

const SCREENS = {
  home: Home,
  chores: Chores,
  calendar: Calendar,
  grocery: Grocery,
  hub: Hub,
}

function App() {
  const [profile, setProfile] = useState(loadProfile)
  const [active, setActive] = useState('home')
  // Which page's "add" flow should auto-open next — set by the quick-add
  // FAB, cleared by the screen once it's acted on it.
  const [pendingAdd, setPendingAdd] = useState(null)

  if (!profile) {
    return (
      <OnboardingFlow
        onComplete={(p) => {
          saveProfile(p)
          setProfile(p)
        }}
      />
    )
  }

  function quickAdd(pageId) {
    setActive(pageId)
    setPendingAdd(pageId)
  }

  const Screen = SCREENS[active]

  return (
    <FamilyProvider profile={profile}>
      <AppShell active={active} onChange={setActive} onQuickAdd={quickAdd}>
        <Screen
          onNavigate={setActive}
          autoOpenAdd={pendingAdd === active}
          onAutoOpenHandled={() => setPendingAdd(null)}
        />
      </AppShell>
    </FamilyProvider>
  )
}

export default App
