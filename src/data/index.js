const files = import.meta.glob('./lessons/*.json', { eager: true, import: 'default' })

// File names start with the unitId (enforced by validate-lessons), so path order is course order.
export const units = Object.keys(files)
  .sort()
  .map((path) => files[path])

export function getUnit(unitId) {
  const unit = units.find((u) => u.unitId === unitId)
  if (!unit) throw new Error(`Unknown unit: ${unitId}`)
  return unit
}
