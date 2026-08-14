// Household reference data for the Homestead UI prototype.
// No backend yet — this is the "UI/UX Prototyping" phase from the product plan.
// Family membership now comes from onboarding (see src/onboarding), so this
// file only holds config that isn't tied to specific people.

export const ROLE_LABEL = {
  hoh: 'Head of Household',
  adult: 'Co-Manager',
  teen: 'Teen',
  kid: 'Kid Mode',
}

// role tiers that see the full manager toolset
export const isManager = (role) => role === 'hoh' || role === 'adult'

export const AISLES = ['Produce', 'Dairy', 'Pantry', 'Household']

export const FREQUENT_ITEMS = ['Bananas', 'Bread', 'Coffee', 'Chicken breast', 'Yogurt']

export const INFO_CARDS = [
  {
    id: 'wifi',
    title: 'Wi-Fi',
    icon: 'Wifi',
    sensitive: true,
    fields: [
      { label: 'Network', value: 'Miller-Home-5G' },
      { label: 'Password', value: 'sunflower&42' },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    icon: 'Phone',
    sensitive: false,
    fields: [
      { label: 'Poison Control', value: '(800) 222-1222' },
      { label: 'Grandma Jean', value: '(512) 555-0148' },
      { label: 'Neighbor — Toms', value: '(512) 555-0172' },
    ],
  },
  {
    id: 'pediatrician',
    title: 'Pediatrician',
    icon: 'Stethoscope',
    sensitive: false,
    fields: [
      { label: 'Dr. Nguyen — Austin Kids Health', value: '(512) 555-0199' },
      { label: 'Portal', value: 'austinkidshealth.example/patient' },
    ],
  },
  {
    id: 'pets',
    title: 'Pet Care',
    icon: 'PawPrint',
    sensitive: false,
    fields: [
      { label: 'Biscuit — feeding', value: '1 cup, 7:30 AM & 6:00 PM' },
      { label: 'Vet — Riverside Animal Clinic', value: '(512) 555-0134' },
    ],
  },
  {
    id: 'sitter',
    title: 'House Sitter Guide',
    icon: 'KeyRound',
    sensitive: false,
    fields: [
      { label: 'Alarm code', value: '2277, then #' },
      { label: 'Trash day', value: 'Tuesday night' },
      { label: 'Mail key', value: 'Kitchen drawer, left of sink' },
    ],
  },
]
