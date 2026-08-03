import { useEffect, useState } from 'react'
import { AppStateProvider, useAppState } from './state/AppStateContext'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import MainApp from './components/MainApp'
import LoadingScreen from './components/LoadingScreen'

const SPLASH_DURATION_MS = 1800

function AppShell() {
  const { profile } = useAppState()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-shell">
      {showSplash ? <LoadingScreen /> : profile?.onboardingComplete ? <MainApp /> : <OnboardingFlow />}
    </div>
  )
}

function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}

export default App
