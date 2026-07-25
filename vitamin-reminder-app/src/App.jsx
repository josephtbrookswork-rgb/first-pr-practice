import { AppStateProvider, useAppState } from './state/AppStateContext'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import MainApp from './components/MainApp'

function AppShell() {
  const { profile } = useAppState()
  return <div className="app-shell">{profile?.onboardingComplete ? <MainApp /> : <OnboardingFlow />}</div>
}

function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}

export default App
