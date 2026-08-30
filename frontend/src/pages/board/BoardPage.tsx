import { useEffect, useRef, useState } from "react"
import { Category } from "../../api"

interface BoardPageProps {
    categories: Category[]
}

interface BoardSpace {
    category?: Category
}

type RoundedCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface PositionedTile {
    x: number
    y: number
    size: number
    width: number
    height: number
    corners: RoundedCorner[]
    color: string
}

interface Notch {
    x: number
    y: number
    size: number
}

const SPACES_PER_CATEGORY = 6
const ALL_PLAY_COUNT = 6
const MIN_TILE_SIZE = 32
const CORNER_RADIUS_RATIO = 0.35
const CURVE_EXTENSION_RATIO = 0.25
// vertical distance between consecutive rows' tops, in tile-size units - 1 (a full tile)
// plus a half-tile gap, which the 0.25 extension on each side then exactly closes
const ROW_SPACING_RATIO = 1.5
const NOTCH_SIZE_RATIO = 0.5
// every tile is this many times wider than it is tall (a fixed unit height, defined by `size`)
const WIDTH_RATIO = 1.25

// 6 spaces per category, interleaved with ALL_PLAY_COUNT neutral "all play" spaces.
// Total = 6 * (categories.length + 1)
function buildSpaces(categories: Category[]): BoardSpace[] {
    if (categories.length === 0) return []

    const categorySpaces: BoardSpace[] = []
    for (let round = 0; round < SPACES_PER_CATEGORY; round++) {
        categories.forEach(category => categorySpaces.push({ category }))
    }

    const gap = categorySpaces.length / ALL_PLAY_COUNT
    const spaces: BoardSpace[] = []
    let nextAllPlayAt = gap
    let allPlayInserted = 0

    categorySpaces.forEach((space, i) => {
        spaces.push(space)
        if (allPlayInserted < ALL_PLAY_COUNT && i + 1 >= nextAllPlayAt) {
            spaces.push({})
            allPlayInserted++
            nextAllPlayAt += gap
        }
    })

    return spaces
}

// Picks a column count that exactly divides `total` with an odd number of rows
// (so the first row and the last row both run left-to-right, landing the path
// top-left to bottom-right), maximising tile size (at a fixed WIDTH_RATIO) for the container.
function computeGrid(width: number, height: number, total: number, minSize: number) {
    const candidates: { cols: number, rows: number }[] = []
    for (let cols = 1; cols <= total; cols++) {
        if (total % cols !== 0) continue
        const rows = total / cols
        if (rows % 2 !== 1) continue
        candidates.push({ cols, rows })
    }

    // every tile is WIDTH_RATIO times wider than the unit height, uniformly - no per-tile extension
    // or margin needed, since every tile fits exactly within its own column slot
    const sizeOf = (c: { cols: number, rows: number }) => Math.min(
        width / (c.cols * WIDTH_RATIO),
        height / ((c.rows - 1) * ROW_SPACING_RATIO + 1),
    )

    const withMin = candidates.filter(c => sizeOf(c) >= minSize)
    const pool = withMin.length > 0 ? withMin : candidates

    let best = pool[0]
    let bestSize = sizeOf(pool[0])
    for (const c of pool) {
        const size = sizeOf(c)
        if (size > bestSize) {
            bestSize = size
            best = c
        }
    }

    return { cols: best.cols, rows: best.rows, size: bestSize }
}

function layoutTiles(spaces: BoardSpace[], width: number, height: number): { tiles: PositionedTile[], notches: Notch[] } {
    if (spaces.length === 0) return { tiles: [], notches: [] }

    const { cols, rows, size } = computeGrid(width, height, spaces.length, MIN_TILE_SIZE)
    const gridHeightUnits = (rows - 1) * ROW_SPACING_RATIO + 1
    const colWidth = size * WIDTH_RATIO

    const offsetX = (width - cols * colWidth) / 2
    const offsetY = (height - gridHeightUnits * size) / 2

    const tiles: PositionedTile[] = []
    const notches: Notch[] = []

    for (let r = 0; r < rows; r++) {
        const dir = r % 2 === 0 ? 1 : -1
        const rowSpaces = spaces.slice(r * cols, r * cols + cols)

        rowSpaces.forEach((space, c) => {
            const gridCol = dir === 1 ? c : cols - 1 - c
            const isFirst = c === 0
            const isLast = c === rowSpaces.length - 1

            const corners: RoundedCorner[] = []

            // first tile of a row connects up to a connector, except the very first tile of the
            // board (no connector above it) - that one is a true dead-end, so round both its free corners
            if (isFirst) {
                if (r === 0) corners.push('top-left', 'bottom-left')
                else corners.push(dir === 1 ? 'bottom-left' : 'bottom-right')
            }

            // last tile of a row connects down to the next row, except the very last tile of the
            // board (nothing below it) - a true dead-end, round both its free corners
            if (isLast) {
                if (r === rows - 1) corners.push('top-right', 'bottom-right')
                else corners.push(dir === 1 ? 'top-right' : 'top-left')
            }

            // curve tiles (first/last of a row, bordering an actual gap to the next/previous row)
            // stretch a quarter-tile taller too - the row's last tile grows downward (top edge
            // anchored), the row's first tile grows upward (bottom edge anchored). The board's
            // absolute start/end tiles don't border a gap, so they stay normal height.
            const isCurveTile = (isFirst && r > 0) || (isLast && r < rows - 1)
            const tileHeight = isCurveTile ? size * (1 + CURVE_EXTENSION_RATIO) : size
            const rowTop = offsetY + (ROW_SPACING_RATIO * r) * size
            const y = isFirst && r > 0
                ? rowTop - size * CURVE_EXTENSION_RATIO
                : rowTop

            tiles.push({
                x: offsetX + gridCol * colWidth,
                y,
                size,
                width: colWidth,
                height: tileHeight,
                corners,
                color: space.category?.color ?? "white",
            })
        })

        // the two tiles bordering this row transition are stacked at the same column, so their
        // shared inner edge meets the row content at a sharp corner - overlay a small bg-colored
        // rounded square right at that seam to fake a concave curve there too
        if (r < rows - 1) {
            const boundaryCol = dir === 1 ? cols - 1 : 0
            const rowTop = offsetY + (ROW_SPACING_RATIO * r) * size
            const seamY = rowTop + size * (1 + CURVE_EXTENSION_RATIO)
            const tileX = offsetX + boundaryCol * colWidth
            const innerX = boundaryCol === cols - 1 ? tileX : tileX + colWidth

            const notchSize = size * NOTCH_SIZE_RATIO
            notches.push({
                x: innerX - notchSize / 2,
                y: seamY - notchSize / 2,
                size: notchSize,
            })
        }
    }

    return { tiles, notches }
}

// A rectangle outline with any subset of its 4 corners rounded, via optional arcs.
function roundedCornerPath(x: number, y: number, width: number, height: number, radius: number, corners: RoundedCorner[]): string {
    const tl = corners.includes('top-left') ? radius : 0
    const tr = corners.includes('top-right') ? radius : 0
    const br = corners.includes('bottom-right') ? radius : 0
    const bl = corners.includes('bottom-left') ? radius : 0

    return [
        `M ${x + tl} ${y}`,
        `L ${x + width - tr} ${y}`,
        tr ? `A ${tr} ${tr} 0 0 1 ${x + width} ${y + tr}` : '',
        `L ${x + width} ${y + height - br}`,
        br ? `A ${br} ${br} 0 0 1 ${x + width - br} ${y + height}` : '',
        `L ${x + bl} ${y + height}`,
        bl ? `A ${bl} ${bl} 0 0 1 ${x} ${y + height - bl}` : '',
        `L ${x} ${y + tl}`,
        tl ? `A ${tl} ${tl} 0 0 1 ${x + tl} ${y}` : '',
        'Z',
    ].filter(Boolean).join(' ')
}

interface TileProps { 
    x: number,
    y: number,
    size: number, 
    height: number,
    radius: number,
    color: string,
    corners: RoundedCorner[],
    stroke: string,
    strokeWidth: number
}

function Tile({ x, y, size, height, radius, color, corners, stroke, strokeWidth }: TileProps) {
    return <path
        d={roundedCornerPath(x, y, size, height, radius, corners)}
        fill={color}
        // stroke={stroke}
        // strokeWidth={strokeWidth}
    />
}

export default function BoardPage({ categories }: BoardPageProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            if (width > 0 && height > 0) setDimensions({ width, height })
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const spaces = buildSpaces(categories)
    const { tiles, notches } = layoutTiles(spaces, dimensions.width, dimensions.height)

    return (
        <main className="max-w-xl mx-auto w-full flex flex-col items-center gap-4 p-4 h-[calc(100vh-3.75rem)]">
            <h2>Board</h2>
            <div ref={containerRef} className="w-full flex-1 min-h-0">
                <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full">
                    {tiles.map((tile, i) => (
                        <Tile
                            key={i}
                            x={tile.x}
                            y={tile.y}
                            size={tile.width}
                            height={tile.height}
                            radius={tile.size * CORNER_RADIUS_RATIO}
                            color={tile.color}
                            corners={tile.corners}
                            stroke="var(--text)"
                            strokeWidth={2}
                        />
                    ))}
                    {notches.map((notch, i) => (
                        <rect
                            key={i}
                            x={notch.x}
                            y={notch.y}
                            width={notch.size}
                            height={notch.size}
                            rx={notch.size * CORNER_RADIUS_RATIO}
                            fill="var(--bg)"
                        />
                    ))}
                </svg>
            </div>
        </main>
    )
}
