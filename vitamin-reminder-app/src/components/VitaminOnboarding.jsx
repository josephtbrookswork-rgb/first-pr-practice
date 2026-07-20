import { useMemo, useState } from 'react'
import {
  DISCLAIMER,
  getAgeGroupForAge,
} from '../utils/vitaminRecommendations'

const MIN_VALID_AGE = 0
const MAX_VALID_AGE = 120

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function VitaminOnboarding({ onSave, initialProfile }) {
  const [ageInput, setAgeInput] = useState(() =>
    initialProfile?.age != null ? String(initialProfile.age) : '',
  )
  const [submittedAge, setSubmittedAge] = useState(() => initialProfile?.age ?? null)
  const [ageError, setAgeError] = useState('')

  const [selectedNames, setSelectedNames] = useState(
    () => new Set(initialProfile?.selectedVitamins?.map((v) => v.name) ?? []),
  )
  const [customVitamins, setCustomVitamins] = useState(
    () => initialProfile?.customVitamins ?? [],
  )
  const [customName, setCustomName] = useState('')
  const [customDosage, setCustomDosage] = useState('')

  const [saved, setSaved] = useState(false)

  const ageGroup = useMemo(
    () => (submittedAge === null ? null : getAgeGroupForAge(submittedAge)),
    [submittedAge],
  )

  function handleAgeSubmit(event) {
    event.preventDefault()
    const trimmedInput = ageInput.trim()
    const parsedAge = Number(trimmedInput)

    if (
      trimmedInput === '' ||
      !Number.isInteger(parsedAge) ||
      parsedAge < MIN_VALID_AGE ||
      parsedAge > MAX_VALID_AGE
    ) {
      setAgeError(`Please enter a whole number age between ${MIN_VALID_AGE} and ${MAX_VALID_AGE}.`)
      setSubmittedAge(null)
      return
    }

    setAgeError('')
    setSelectedNames(new Set())
    setSaved(false)
    setSubmittedAge(parsedAge)
  }

  function toggleVitamin(name) {
    setSaved(false)
    setSelectedNames((previous) => {
      const next = new Set(previous)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  function handleAddCustomVitamin(event) {
    event.preventDefault()
    const trimmedName = customName.trim()
    if (!trimmedName) return

    setCustomVitamins((previous) => [
      ...previous,
      { id: createId(), name: trimmedName, dosage: customDosage.trim() },
    ])
    setCustomName('')
    setCustomDosage('')
    setSaved(false)
  }

  function handleRemoveCustomVitamin(id) {
    setCustomVitamins((previous) => previous.filter((item) => item.id !== id))
    setSaved(false)
  }

  function handleSave() {
    const selectedRecommended = (ageGroup?.vitamins ?? []).filter((vitamin) =>
      selectedNames.has(vitamin.name),
    )

    onSave({
      age: submittedAge,
      ageGroupId: ageGroup?.id ?? null,
      ageGroupLabel: ageGroup?.label ?? null,
      selectedVitamins: selectedRecommended,
      customVitamins,
    })
    setSaved(true)
  }

  const hasSelections = selectedNames.size > 0 || customVitamins.length > 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <form
        onSubmit={handleAgeSubmit}
        noValidate
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="age" className="block text-sm font-medium text-slate-700">
            What's your age?
          </label>
          <input
            id="age"
            type="number"
            min={MIN_VALID_AGE}
            max={MAX_VALID_AGE}
            step="1"
            inputMode="numeric"
            value={ageInput}
            onChange={(event) => setAgeInput(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g. 34"
          />
        </div>
        <button
          type="submit"
          className="w-full shrink-0 rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
        >
          Get recommendations
        </button>
      </form>
      {ageError && <p className="mt-2 text-sm text-red-600">{ageError}</p>}

      {submittedAge !== null && !ageError && (
        <div className="mt-8">
          {!ageGroup ? (
            <p className="text-slate-600">
              We don't have general recommendations for this age. Please consult
              a pediatrician or doctor directly.
            </p>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-slate-900">
                Recommended for {ageGroup.label} (age {submittedAge})
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the vitamins you'd like to add to your daily routine.
              </p>

              <ul className="mt-4 space-y-3">
                {ageGroup.vitamins.map((vitamin) => (
                  <li
                    key={vitamin.name}
                    className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4"
                  >
                    <input
                      type="checkbox"
                      id={`vitamin-${vitamin.name}`}
                      checked={selectedNames.has(vitamin.name)}
                      onChange={() => toggleVitamin(vitamin.name)}
                      className="mt-1 h-4 w-4"
                    />
                    <label htmlFor={`vitamin-${vitamin.name}`} className="flex-1">
                      <span className="block font-medium text-slate-900">
                        {vitamin.name}{' '}
                        <span className="font-normal text-slate-500">
                          &mdash; {vitamin.dosage}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {vitamin.note}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
                <h3 className="font-medium text-slate-900">
                  Already taking something else?
                </h3>
                <form
                  onSubmit={handleAddCustomVitamin}
                  className="mt-3 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-end"
                >
                  <div className="flex-1 min-w-[10rem]">
                    <label
                      htmlFor="customName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Vitamin / supplement name
                    </label>
                    <input
                      id="customName"
                      type="text"
                      value={customName}
                      onChange={(event) => setCustomName(event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Omega-3"
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <label
                      htmlFor="customDosage"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Dosage (optional)
                    </label>
                    <input
                      id="customDosage"
                      type="text"
                      value={customDosage}
                      onChange={(event) => setCustomDosage(event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. 1000mg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full shrink-0 rounded-md bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 sm:w-auto"
                  >
                    Add
                  </button>
                </form>

                {customVitamins.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {customVitamins.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span>
                          {item.name}
                          {item.dosage && (
                            <span className="text-slate-500"> &mdash; {item.dosage}</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomVitamin(item.id)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasSelections}
                className="mt-6 w-full rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Save my routine
              </button>
              {saved && (
                <p className="mt-2 text-sm text-teal-700">
                  Your selections have been saved.
                </p>
              )}

              <p className="mt-6 text-xs text-slate-500">{DISCLAIMER}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default VitaminOnboarding
