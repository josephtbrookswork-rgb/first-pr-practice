import { useEffect, useState } from 'react'
import VitaminOnboarding from './components/VitaminOnboarding'
import VitaminDashboard from './components/VitaminDashboard'
import { loadUserProfile, saveUserProfile } from './utils/storage'

function App() {
  const [userProfile, setUserProfile] = useState(loadUserProfile)

  useEffect(() => {
    saveUserProfile(userProfile)
  }, [userProfile])

  function handleUpdateProfile(partialProfile) {
    setUserProfile((previous) => (previous ? { ...previous, ...partialProfile } : previous))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto max-w-3xl px-4 py-8 text-center">
        <h1 className="text-3xl font-semibold">Vitamin Reminder</h1>
        <p className="mt-2 text-slate-600">
          Personalized vitamin reminders and recommendations.
        </p>
      </header>

      <VitaminOnboarding onSave={setUserProfile} initialProfile={userProfile} />

      <hr className="mx-auto max-w-2xl border-slate-200" />

      <VitaminDashboard userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
    </div>
  )
}

export default App
