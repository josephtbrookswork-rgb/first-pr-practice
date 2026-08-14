import { useState } from 'react'
import { PartyPopper } from 'lucide-react'
import { TUTORIAL_STEPS } from './tutorialSteps.js'
import { PAGE_COLOR } from '../lib/colors.js'

export default function Tutorial({ profile, onFinish }) {
  const [index, setIndex] = useState(0)
  const total = TUTORIAL_STEPS.length + 1 // + closing step
  const isClosing = index === TUTORIAL_STEPS.length
  const step = isClosing ? null : TUTORIAL_STEPS[index]
  const color = PAGE_COLOR[step ? step.colorKey : 'home']

  function next() {
    if (index < total - 1) setIndex((i) => i + 1)
    else onFinish()
  }

  function back() {
    setIndex((i) => Math.max(0, i - 1))
  }

  return (
    <div className="safe-top safe-bottom flex h-dvh w-full flex-col bg-neutral-100 px-6 py-8">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <button
          type="button"
          onClick={onFinish}
          className="self-end text-sm font-semibold text-neutral-500"
        >
          Skip
        </button>

        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          {isClosing ? (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-pg-green-600 text-white">
                <PartyPopper size={30} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  You're all set, {profile.name}!
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                  Homestead is ready to go. You can find your profile any time by tapping your
                  avatar in the top bar.
                </p>
              </div>
            </>
          ) : (
            <>
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-[20px] ${color.icon}`}
              >
                <step.icon size={30} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{step.title}</h1>
                <p className="mt-2 text-sm text-neutral-600">{step.body}</p>
              </div>
            </>
          )}
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? 'w-6 bg-slate-600' : 'w-1.5 bg-neutral-300'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {index > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex-1 rounded-[var(--radius-pill)] border border-neutral-200 bg-white px-4 py-3.5 text-base font-semibold text-neutral-700"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-[var(--radius-pill)] bg-slate-600 px-4 py-3.5 text-base font-semibold text-white"
          >
            {isClosing ? 'Enter Homestead' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
