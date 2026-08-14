import { useState } from 'react'
import SignUp from './SignUp.jsx'
import Tutorial from './Tutorial.jsx'

export default function OnboardingFlow({ onComplete }) {
  const [profile, setProfile] = useState(null)

  if (!profile) {
    return <SignUp onContinue={setProfile} />
  }

  return <Tutorial profile={profile} onFinish={() => onComplete(profile)} />
}
