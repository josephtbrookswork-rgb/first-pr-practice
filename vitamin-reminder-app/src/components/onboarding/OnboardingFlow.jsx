import { useRef, useState } from 'react'
import { useAppState } from '../../state/AppStateContext'
import { TUTORIALS } from '../../data/tutorials'
import ProgressDots from '../ui/ProgressDots'
import TutorialStep from '../tutorial/TutorialStep'
import WelcomeStep from './WelcomeStep'
import NameStep from './NameStep'
import AgeStep from './AgeStep'
import LocationStep from './LocationStep'
import SplashStep from './SplashStep'

const TUTORIAL_ORDER = ['home', 'schedule', 'calendar', 'pantry']
const SCREEN_LABEL = { home: 'Home', schedule: 'Schedule', calendar: 'Calendar', pantry: 'Pantry' }
const TUTORIAL_START_STEP = 4
const SPLASH_STEP = TUTORIAL_START_STEP + TUTORIAL_ORDER.length
const STEP_COUNT = SPLASH_STEP + 1

function OnboardingFlow() {
  const { completeOnboarding } = useAppState()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [locationData, setLocationData] = useState(null)
  const headingRef = useRef(null)

  function goToStep(next) {
    setStep(next)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function handleLocationDecision(locationGranted, coords) {
    setLocationData({
      locationGranted,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    })
    goToStep(TUTORIAL_START_STEP)
  }

  function handleFinish() {
    completeOnboarding({
      name: name.trim(),
      age: Number(age),
      ...locationData,
    })
  }

  return (
    <div className="screen-viewport">
      <main id="main-content" className="screen-main" style={{ paddingTop: 'max(var(--space-4), env(safe-area-inset-top))' }}>
        <div key={step} className="page-transition" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {step === 0 && <WelcomeStep headingRef={headingRef} onNext={() => goToStep(1)} />}
          {step === 1 && (
            <NameStep
              headingRef={headingRef}
              name={name}
              onChangeName={setName}
              onBack={() => goToStep(0)}
              onNext={() => goToStep(2)}
            />
          )}
          {step === 2 && (
            <AgeStep
              headingRef={headingRef}
              age={age}
              onChangeAge={setAge}
              onBack={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}
          {step === 3 && (
            <LocationStep headingRef={headingRef} onBack={() => goToStep(2)} onDecision={handleLocationDecision} />
          )}
          {TUTORIAL_ORDER.map((screenId, tutorialIndex) => {
            const stepIndex = TUTORIAL_START_STEP + tutorialIndex
            if (step !== stepIndex) return null
            const isLastTutorial = tutorialIndex === TUTORIAL_ORDER.length - 1
            return (
              <TutorialStep
                key={screenId}
                headingRef={headingRef}
                tutorial={TUTORIALS[screenId]}
                stepLabel={`Step ${stepIndex + 1} of ${STEP_COUNT}: how ${SCREEN_LABEL[screenId]} works`}
                onBack={() => goToStep(stepIndex - 1)}
                onNext={() => goToStep(stepIndex + 1)}
                nextLabel={isLastTutorial ? 'Continue' : 'Next'}
              />
            )
          })}
          {step === SPLASH_STEP && <SplashStep headingRef={headingRef} onFinish={handleFinish} />}
        </div>
      </main>
      <ProgressDots total={STEP_COUNT} activeIndex={step} />
    </div>
  )
}

export default OnboardingFlow
