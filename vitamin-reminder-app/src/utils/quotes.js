// Original lines written for Solaris — themed around rhythm, light, and
// small daily rituals. Picked once per app session (see AppStateContext).
export const QUOTES = [
  'Small rituals, repeated, become a rhythm.',
  'Let the day catch up with the sun, not the other way around.',
  'Consistency is quieter than motivation, and it lasts longer.',
  'One dose, one breath, one anchor at a time.',
  'The body keeps its own clock — feed it on time.',
  'Dawn asks little of you. Just show up for it.',
  'A steady habit is a kind of quiet confidence.',
  'You don’t need more hours, just a better rhythm.',
  'Light comes back every day. So can your routine.',
  'Care for yourself the way you’d care for a garden — daily, gently.',
  'Today’s stack is tomorrow’s momentum.',
  'Rest and light are both nutrients.',
]

export function pickRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}
