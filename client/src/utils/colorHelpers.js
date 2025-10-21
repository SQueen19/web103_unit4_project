export function isHexColor(value) {
  if (!value) return false
  return /^#([0-9A-F]{3}){1,2}$/i.test(value)
}

export function isOtherColor(value) {
  if (!value) return false
  // we treat any hex value as a custom color; named colors are non-hex strings
  return isHexColor(value) || value === 'Other'
}

export function getColorValue(value) {
  if (!value) return 'transparent'
  if (isHexColor(value)) return value

  // map named colors to hex (basic mapping)
  const map = {
    Red: '#c62828',
    Blue: '#1565c0',
    Green: '#2e7d32',
    Yellow: '#f9a825',
    Purple: '#6a1b9a',
    Orange: '#ef6c00',
    Black: '#000000',
    White: '#ffffff',
    Silver: '#c0c0c0',
  }
  return map[value] || 'transparent'
}
