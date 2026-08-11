// Mock family data for the Homestead UI prototype.
// No backend yet — this is the "UI/UX Prototyping" phase from the product plan.

export const MEMBERS = [
  { id: 'sarah', name: 'Sarah', role: 'hoh', initials: 'S', color: 'slate', streak: 6 },
  { id: 'david', name: 'David', role: 'adult', initials: 'D', color: 'sage', streak: 4 },
  { id: 'marcus', name: 'Marcus', role: 'teen', initials: 'M', color: 'amber', streak: 3, stars: 140 },
  { id: 'lily', name: 'Lily', role: 'kid', initials: 'L', color: 'danger', streak: 5, stars: 85 },
]

export const ROLE_LABEL = {
  hoh: 'Head of Household',
  adult: 'Co-Manager',
  teen: 'Teen',
  kid: 'Kid Mode',
}

// role tiers that see the full manager toolset
export const isManager = (role) => role === 'hoh' || role === 'adult'

export const INITIAL_CHORES = [
  {
    id: 'c1',
    title: 'Walk the dog',
    assignedTo: 'marcus',
    status: 'awaiting_approval',
    due: 'Today, 5:00 PM',
    recurring: 'daily',
    requiresPhoto: true,
    photoSubmitted: true,
    points: 10,
    subtasks: [],
  },
  {
    id: 'c2',
    title: 'Empty dishwasher',
    assignedTo: 'marcus',
    status: 'awaiting_approval',
    due: 'Today, 4:30 PM',
    recurring: 'daily',
    requiresPhoto: false,
    photoSubmitted: false,
    points: 5,
    subtasks: [],
  },
  {
    id: 'c3',
    title: 'Clean bedroom',
    assignedTo: 'lily',
    status: 'pending',
    due: 'Today, 6:00 PM',
    recurring: 'weekly',
    requiresPhoto: false,
    points: 15,
    subtasks: [
      { id: 'c3-1', title: 'Make the bed', done: true },
      { id: 'c3-2', title: 'Put away toys', done: false },
      { id: 'c3-3', title: 'Vacuum floor', done: false },
    ],
  },
  {
    id: 'c4',
    title: 'Take out recycling',
    assignedTo: 'open',
    status: 'pending',
    due: 'Tomorrow, 8:00 AM',
    recurring: 'weekly',
    requiresPhoto: false,
    points: 5,
    subtasks: [],
  },
  {
    id: 'c5',
    title: 'Water the garden',
    assignedTo: 'david',
    status: 'completed',
    due: 'Today, 9:00 AM',
    recurring: 'daily',
    requiresPhoto: false,
    points: 5,
    subtasks: [],
  },
  {
    id: 'c6',
    title: 'Pack sports bag',
    assignedTo: 'marcus',
    status: 'pending',
    due: 'Today, 3:30 PM',
    recurring: 'none',
    requiresPhoto: false,
    points: 5,
    linkedEvent: 'e2',
    subtasks: [
      { id: 'c6-1', title: 'Cleats', done: false },
      { id: 'c6-2', title: 'Shin guards', done: false },
      { id: 'c6-3', title: 'Water bottle', done: false },
    ],
  },
  {
    id: 'c7',
    title: 'Feed the cat',
    assignedTo: 'lily',
    status: 'completed',
    due: 'Today, 7:30 AM',
    recurring: 'daily',
    requiresPhoto: false,
    points: 5,
    subtasks: [],
  },
]

// dayOffset is relative to today (0 = today, 1 = tomorrow, ...)
export const INITIAL_EVENTS = [
  { id: 'e1', title: 'Family breakfast', dayOffset: 0, time: '8:00 AM', members: ['sarah', 'david', 'marcus', 'lily'] },
  { id: 'e2', title: 'Soccer practice', dayOffset: 0, time: '4:00 PM', members: ['marcus'], linkedChore: 'c6' },
  { id: 'e3', title: 'Parent-teacher call', dayOffset: 0, time: '7:00 PM', members: ['sarah'] },
  { id: 'e4', title: 'Vet appointment — Biscuit', dayOffset: 1, time: '10:30 AM', members: ['david'] },
  { id: 'e5', title: "Lily's piano lesson", dayOffset: 1, time: '3:30 PM', members: ['lily'] },
  { id: 'e6', title: 'Grocery run', dayOffset: 3, time: '5:30 PM', members: ['sarah', 'david'] },
  { id: 'e7', title: 'Movie night', dayOffset: 5, time: '7:30 PM', members: ['sarah', 'david', 'marcus', 'lily'] },
]

export const AISLES = ['Produce', 'Dairy', 'Pantry', 'Household']

export const INITIAL_GROCERIES = [
  { id: 'g1', name: 'Avocados', aisle: 'Produce', status: 'active' },
  { id: 'g2', name: 'Spinach', aisle: 'Produce', status: 'active' },
  { id: 'g3', name: 'Milk', aisle: 'Dairy', status: 'active' },
  { id: 'g4', name: 'Eggs', aisle: 'Dairy', status: 'active' },
  { id: 'g5', name: 'Shredded cheese', aisle: 'Dairy', status: 'active' },
  { id: 'g6', name: 'Pasta', aisle: 'Pantry', status: 'active' },
  { id: 'g7', name: 'Peanut butter', aisle: 'Pantry', status: 'active' },
  { id: 'g8', name: 'Paper towels', aisle: 'Household', status: 'active' },
  { id: 'g9', name: 'Dish soap', aisle: 'Household', status: 'active' },
  { id: 'g10', name: 'Ice cream sandwiches', aisle: 'Dairy', status: 'pending_request', requestedBy: 'marcus' },
  { id: 'g11', name: 'Fruit snacks', aisle: 'Pantry', status: 'pending_request', requestedBy: 'lily' },
]

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
