interface Props {
  shape: string
  color: string
  size: number
}

const CROSS_D = "M0,-40 L13,-10 L40,0 L13,10 L0,40 L-13,10 L-40,0 L-13,-10 Z M0,-21 L7,-5 L21,0 L7,5 L0,21 L-7,5 L-21,0 L-7,-5 Z"
const PENTAGON_D = "M50,0 L100,38 L82,100 L18,100 L0,38 Z M50,25 L77,46 L68,80 L32,80 L22,46 Z"
const MOON_D = "M21.46,16.54A10.51,10.51,0,1,1,12,1.49a10.34,10.34,0,0,1,2.8.38,8.12,8.12,0,0,0,2.45,15.86A8,8,0,0,0,21.46,16.54Z"

const DIAMOND_POLYS = [
  "50,6 70,26 50,46 30,26",
  "74,30 94,50 74,70 54,50",
  "50,54 70,74 50,94 30,74",
  "26,30 46,50 26,70 6,50",
]

const TRIANGLE_POLYS = [
  "50,0 24,52 76,52",
  "18,64 0,100 100,100 82,64",
]

function grad(id: string, y1: number, y2: number, units = 'userSpaceOnUse') {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1={y1} x2="0" y2={y2} gradientUnits={units}>
        <stop offset="0%" stopColor="white" stopOpacity="0.45" />
        <stop offset="100%" stopColor="black" stopOpacity="0.35" />
      </linearGradient>
    </defs>
  )
}

const SH = 'drop-shadow(0 0 6px black)'
const SW = 5

export default function MinimapIcon({ shape, color, size }: Props) {
  switch (shape) {
    case 'Circle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <circle cx="50" cy="50" r="47" fill={color} />
          <circle cx="50" cy="50" r="47" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Square':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <rect width="100" height="100" fill={color} />
          <rect width="100" height="100" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill={color} />
          <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Star':
      return (
        <svg width={size} height={size} viewBox="5 2 90 88" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={color} />
          <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Kite':
      return (
        <svg width={size} height={size} viewBox="-15 0 130 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <polygon points="50,0 100,30 50,100 0,30" fill={color} />
          <polygon points="50,0 100,30 50,100 0,30" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Raindrop':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <polygon points="50,0 64,18 76,36 84,52 87,66 84,80 75,91 62,98 50,100 38,98 25,91 16,80 13,66 16,52 24,36 36,18" fill={color} />
          <polygon points="50,0 64,18 76,36 84,52 87,66 84,80 75,91 62,98 50,100 38,98 25,91 16,80 13,66 16,52 24,36 36,18" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'UpsideDownHouse':
      return (
        <svg width={size} height={size} viewBox="-15 0 130 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <polygon points="0,0 100,0 100,60 50,100 0,60" fill={color} />
          <polygon points="0,0 100,0 100,60 50,100 0,60" fill="url(#g)" stroke="black" strokeWidth={SW} />
        </svg>
      )

    case 'Diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          {DIAMOND_POLYS.map(pts => <polygon key={pts} points={pts} fill={color} />)}
          {DIAMOND_POLYS.map(pts => <polygon key={pts + 'g'} points={pts} fill="url(#g)" stroke="black" strokeWidth={SW} />)}
        </svg>
      )

    case 'Triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          {TRIANGLE_POLYS.map(pts => <polygon key={pts} points={pts} fill={color} />)}
          {TRIANGLE_POLYS.map(pts => <polygon key={pts + 'g'} points={pts} fill="url(#g)" stroke="black" strokeWidth={SW} />)}
        </svg>
      )

    case 'Cross':
      return (
        <svg width={size} height={size} viewBox="-44 -44 88 88" overflow="visible" style={{ filter: SH }}>
          {grad('g', -44, 44)}
          <path fillRule="evenodd" fill={color} d={CROSS_D} />
          <path fillRule="evenodd" fill="url(#g)" stroke="black" strokeWidth={2} d={CROSS_D} />
        </svg>
      )

    case 'Pentagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 100)}
          <path fillRule="evenodd" fill={color} d={PENTAGON_D} />
          <path fillRule="evenodd" fill="url(#g)" stroke="black" strokeWidth={SW} d={PENTAGON_D} />
        </svg>
      )

    case 'Moon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" overflow="visible" style={{ filter: SH }}>
          {grad('g', 0, 24)}
          <path fill={color} transform="rotate(295 12 12)" d={MOON_D} />
          <path fill="url(#g)" stroke="black" strokeWidth={1.2} transform="rotate(295 12 12)" d={MOON_D} />
        </svg>
      )

    default:
      return null
  }
}
