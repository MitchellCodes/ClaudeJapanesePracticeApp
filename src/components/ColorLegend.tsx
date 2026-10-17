import { LEGEND } from '../lib/color'

export default function ColorLegend() {
  return (
    <ul className="legend" aria-label="Color key">
      {LEGEND.map((l) => (
        <li key={l.label}>
          <span
            className={`swatch ${l.hue === undefined ? 'unseen' : ''}`}
            style={l.hue === undefined ? undefined : ({ '--h': l.hue } as React.CSSProperties)}
          />
          {l.label}
        </li>
      ))}
    </ul>
  )
}
