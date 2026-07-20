/**
 * General, non-personalized vitamin guidance by age group.
 * Dosages are approximate daily targets based on commonly published
 * general nutrition guidelines (e.g. NIH Office of Dietary Supplements)
 * and are intended as a starting point only.
 */

export const DISCLAIMER =
  'These recommendations are general guidelines only, not medical advice. ' +
  'Individual needs vary based on health conditions, medications, diet, pregnancy/breastfeeding status, ' +
  'and lab results. Consult a doctor, pharmacist, or registered dietitian before starting, changing, ' +
  'or stopping any supplement.'

export const AGE_GROUPS = {
  CHILDREN: 'children',
  TEENS: 'teens',
  YOUNG_ADULTS: 'young_adults',
  MIDDLE_AGED_ADULTS: 'middle_aged_adults',
  SENIORS: 'seniors',
}

export const vitaminRecommendations = [
  {
    id: AGE_GROUPS.CHILDREN,
    label: 'Children',
    ageRange: { min: 4, max: 12 },
    vitamins: [
      {
        name: 'Vitamin D',
        dosage: '600 IU (15 mcg) per day',
        note: 'Supports bone growth and immune function.',
      },
      {
        name: 'Vitamin B12',
        dosage: '1.2–1.8 mcg per day',
        note: 'Important for growth, nerve function, and red blood cell formation.',
      },
      {
        name: 'Calcium',
        dosage: '800–1300 mg per day',
        note: 'Critical for developing bones and teeth.',
      },
      {
        name: 'Multivitamin',
        dosage: 'One age-appropriate children\'s formula per day',
        note: 'Choose a formula labeled for the child\'s age range.',
      },
    ],
  },
  {
    id: AGE_GROUPS.TEENS,
    label: 'Teens',
    ageRange: { min: 13, max: 19 },
    vitamins: [
      {
        name: 'Vitamin D',
        dosage: '600 IU (15 mcg) per day',
        note: 'Supports bone density during rapid growth.',
      },
      {
        name: 'Vitamin B12',
        dosage: '2.4 mcg per day',
        note: 'Supports energy metabolism and cognitive development.',
      },
      {
        name: 'Calcium',
        dosage: '1300 mg per day',
        note: 'Peak bone mass is built during adolescence.',
      },
      {
        name: 'Multivitamin',
        dosage: 'One standard adult/teen formula per day',
        note: 'Look for formulas including iron, especially for menstruating teens.',
      },
    ],
  },
  {
    id: AGE_GROUPS.YOUNG_ADULTS,
    label: 'Young Adults',
    ageRange: { min: 20, max: 39 },
    vitamins: [
      {
        name: 'Vitamin D',
        dosage: '600 IU (15 mcg) per day',
        note: 'Especially important with limited sun exposure.',
      },
      {
        name: 'Vitamin B12',
        dosage: '2.4 mcg per day',
        note: 'Plant-based diets may require supplementation.',
      },
      {
        name: 'Calcium',
        dosage: '1000 mg per day',
        note: 'Maintains bone density built in earlier years.',
      },
      {
        name: 'Multivitamin',
        dosage: 'One standard adult formula per day',
        note: 'Useful as a nutritional safety net for busy schedules.',
      },
    ],
  },
  {
    id: AGE_GROUPS.MIDDLE_AGED_ADULTS,
    label: 'Middle-Aged Adults',
    ageRange: { min: 40, max: 59 },
    vitamins: [
      {
        name: 'Vitamin D',
        dosage: '600–800 IU (15–20 mcg) per day',
        note: 'Supports bone health as natural density decline begins.',
      },
      {
        name: 'Vitamin B12',
        dosage: '2.4 mcg per day',
        note: 'Absorption efficiency can start to decline with age.',
      },
      {
        name: 'Calcium',
        dosage: '1000 mg per day',
        note: 'Helps offset gradual bone density loss.',
      },
      {
        name: 'Multivitamin',
        dosage: 'One standard adult formula per day',
        note: 'Consider formulas with added B-complex for energy support.',
      },
    ],
  },
  {
    id: AGE_GROUPS.SENIORS,
    label: 'Seniors',
    ageRange: { min: 60, max: null },
    vitamins: [
      {
        name: 'Vitamin D',
        dosage: '800–1000 IU (20–25 mcg) per day',
        note: 'Reduced skin synthesis with age increases the need for dietary intake.',
      },
      {
        name: 'Vitamin B12',
        dosage: '2.4 mcg per day (often from fortified foods or supplements)',
        note: 'Age-related drops in stomach acid can reduce natural B12 absorption.',
      },
      {
        name: 'Calcium',
        dosage: '1200 mg per day',
        note: 'Helps reduce fracture risk from age-related bone loss.',
      },
      {
        name: 'Multivitamin',
        dosage: 'One senior-formulated multivitamin per day',
        note: 'Senior formulas typically adjust iron down and B12/D up.',
      },
    ],
  },
]

/**
 * Returns the age-group entry whose range contains the given age,
 * or null if the age is invalid or outside all defined ranges (e.g. under 4).
 */
export function getAgeGroupForAge(age) {
  if (typeof age !== 'number' || Number.isNaN(age) || age < 0) return null

  return (
    vitaminRecommendations.find(({ ageRange }) => {
      const aboveMin = age >= ageRange.min
      const belowMax = ageRange.max === null || age <= ageRange.max
      return aboveMin && belowMax
    }) ?? null
  )
}

/**
 * Returns the vitamin recommendations for a given age, or an empty array
 * if the age falls outside all defined groups.
 */
export function getVitaminRecommendationsForAge(age) {
  return getAgeGroupForAge(age)?.vitamins ?? []
}
