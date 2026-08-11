import { useState } from 'react'
import { FamilyProvider } from './context/FamilyContext.jsx'
import AppShell from './components/layout/AppShell.jsx'
import Home from './screens/Home.jsx'
import Chores from './screens/Chores.jsx'
import Calendar from './screens/Calendar.jsx'
import Grocery from './screens/Grocery.jsx'
import Hub from './screens/Hub.jsx'

const SCREENS = {
  home: Home,
  chores: Chores,
  calendar: Calendar,
  grocery: Grocery,
  hub: Hub,
}

function App() {
  const [active, setActive] = useState('home')
  const Screen = SCREENS[active]

  return (
    <FamilyProvider>
      <AppShell active={active} onChange={setActive}>
        <Screen onNavigate={setActive} />
      </AppShell>
    </FamilyProvider>
  )
}

export default App
