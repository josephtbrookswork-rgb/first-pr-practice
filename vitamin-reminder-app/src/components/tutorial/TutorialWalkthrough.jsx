import { useState } from 'react'
import { TUTORIALS } from '../../data/tutorials'
import ProgressDots from '../ui/ProgressDots'
import TutorialStep from './TutorialStep'

const ORDER = ['home', 'schedule', 'calendar', 'pantry']
const SCREEN_LABEL = { home: 'Home', schedule: 'Schedule', calendar: 'Calendar', pantry: 'Pantry' }

function TutorialWalkthrough({ onClose }) {
  const [index, setIndex] = useState(0)
  const screenId = ORDER[index]
  const isLast = index === ORDER.length - 1

  return (
    <div className="screen-viewport">
      <div key={screenId} className="page-transition screen-main" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <TutorialStep
          tutorial={TUTORIALS[screenId]}
          stepLabel={`How to use ${SCREEN_LABEL[screenId]}, step ${index + 1} of ${ORDER.length}`}
          onBack={() => (index === 0 ? onClose() : setIndex(index - 1))}
          onNext={() => (isLast ? onClose() : setIndex(index + 1))}
          nextLabel={isLast ? 'Done' : 'Next'}
        />
      </div>
      <ProgressDots total={ORDER.length} activeIndex={index} />
    </div>
  )
}

export default TutorialWalkthrough
