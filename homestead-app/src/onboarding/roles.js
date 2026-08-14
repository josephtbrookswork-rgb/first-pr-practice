import { Crown, Users, Sparkles, Star } from 'lucide-react'

// Mirrors data/mockData.js ROLE_LABEL, with the extra description copy
// sign-up needs to explain what each role can actually do.
export const ROLES = [
  {
    id: 'hoh',
    label: 'Head of Household',
    description: 'Full control — assign chores, approve requests, and manage everything.',
    icon: Crown,
  },
  {
    id: 'adult',
    label: 'Co-Manager',
    description: 'Shares the load — can assign chores, approve requests, and manage groceries.',
    icon: Users,
  },
  {
    id: 'teen',
    label: 'Teen',
    description: 'Sees their own tasks, claims open chores, and requests grocery items.',
    icon: Sparkles,
  },
  {
    id: 'kid',
    label: 'Kid Mode',
    description: 'A big, simple view with just their tasks and stars earned.',
    icon: Star,
  },
]
