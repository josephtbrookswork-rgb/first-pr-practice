import { createContext, useContext, useMemo, useState } from 'react'
import {
  MEMBERS,
  INITIAL_CHORES,
  INITIAL_EVENTS,
  INITIAL_GROCERIES,
  isManager,
} from '../data/mockData.js'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const [viewerId, setViewerId] = useState('sarah')
  const [chores, setChores] = useState(INITIAL_CHORES)
  const [events] = useState(INITIAL_EVENTS)
  const [groceries, setGroceries] = useState(INITIAL_GROCERIES)

  const viewer = MEMBERS.find((m) => m.id === viewerId)
  const viewerIsManager = isManager(viewer.role)

  const memberById = useMemo(() => Object.fromEntries(MEMBERS.map((m) => [m.id, m])), [])

  function claimChore(choreId) {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, assignedTo: viewerId } : c)),
    )
  }

  function toggleSubtask(choreId, subtaskId) {
    setChores((prev) =>
      prev.map((c) =>
        c.id === choreId
          ? {
              ...c,
              subtasks: c.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s,
              ),
            }
          : c,
      ),
    )
  }

  function completeChore(choreId, { photoSubmitted } = {}) {
    setChores((prev) =>
      prev.map((c) =>
        c.id === choreId
          ? {
              ...c,
              status: c.requiresPhoto ? 'awaiting_approval' : 'completed',
              photoSubmitted: c.requiresPhoto ? Boolean(photoSubmitted) : c.photoSubmitted,
            }
          : c,
      ),
    )
  }

  function reopenChore(choreId) {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, status: 'pending' } : c)),
    )
  }

  function approveChore(choreId) {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, status: 'completed' } : c)),
    )
  }

  function declineChore(choreId) {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, status: 'pending' } : c)),
    )
  }

  function addChore(chore) {
    setChores((prev) => [
      {
        id: `c${Date.now()}`,
        status: 'pending',
        recurring: 'none',
        requiresPhoto: false,
        points: 5,
        subtasks: [],
        ...chore,
      },
      ...prev,
    ])
  }

  function addGroceryItem(name, aisle = 'Pantry') {
    if (!name.trim()) return
    setGroceries((prev) => [
      {
        id: `g${Date.now()}`,
        name: name.trim(),
        aisle,
        status: viewerIsManager ? 'active' : 'pending_request',
        requestedBy: viewerIsManager ? undefined : viewerId,
      },
      ...prev,
    ])
  }

  function toggleGroceryItem(itemId) {
    setGroceries((prev) =>
      prev.map((g) => (g.id === itemId ? { ...g, checked: !g.checked } : g)),
    )
  }

  function clearCheckedGroceries() {
    setGroceries((prev) => prev.filter((g) => !g.checked))
  }

  function approveGroceryRequest(itemId) {
    setGroceries((prev) =>
      prev.map((g) => (g.id === itemId ? { ...g, status: 'active' } : g)),
    )
  }

  function declineGroceryRequest(itemId) {
    setGroceries((prev) => prev.filter((g) => g.id !== itemId))
  }

  const value = {
    members: MEMBERS,
    memberById,
    viewer,
    viewerIsManager,
    setViewerId,
    chores,
    events,
    groceries,
    claimChore,
    toggleSubtask,
    completeChore,
    reopenChore,
    approveChore,
    declineChore,
    addChore,
    addGroceryItem,
    toggleGroceryItem,
    clearCheckedGroceries,
    approveGroceryRequest,
    declineGroceryRequest,
  }

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider')
  return ctx
}
