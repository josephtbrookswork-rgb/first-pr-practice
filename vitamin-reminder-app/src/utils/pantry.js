export function getPantryStatus(item) {
  const { servingsLeft, totalServings, usagePerDay = 1 } = item
  const percentLeft = totalServings > 0 ? servingsLeft / totalServings : 0
  const daysLeft = usagePerDay > 0 ? Math.round(servingsLeft / usagePerDay) : null

  let level = 'healthy'
  if (servingsLeft <= 5 || percentLeft <= 0.1) {
    level = 'critical'
  } else if (percentLeft <= 0.3) {
    level = 'low'
  }

  return {
    level,
    label: level === 'critical' ? 'Reorder soon' : level === 'low' ? 'Running low' : 'Stocked',
    percentLeft: Math.round(percentLeft * 100),
    daysLeft,
  }
}
