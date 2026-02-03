import type { Rectangle } from "../types/rectangle";
import { getBoxToBoxArrow, type ArrowOptions } from "perfect-arrows";

// 参考自：https://github.com/Little-Languages/quiver

type Arrow = [
    sx: number,
    sy: number,
    cx: number,
    cy: number,
    ex: number,
    ey: number,
    ae: number,
    as: number,
    ac: number
]

function getArrow(source: Rectangle, target: Rectangle, options: ArrowOptions) {
    return getBoxToBoxArrow(
        source.x,
        source.y,
        source.w,
        source.h,
        target.x,
        target.y,
        target.w,
        target.h,
        options
    ) as Arrow;
}

interface Props {
    source: Rectangle;
    target: Rectangle;
}

export function AnimatedArrow(props: Props) {
    const [sx, sy, cx, cy, ex, ey, ae] = (getArrow(props.source, props.target, {
        bow: 0,
        stretch: 0.25,
        stretchMin: 50,
        stretchMax: 420,
        padStart: 0,
        padEnd: 20,
        flip: false,
        straights: true
    }));

    return (
        <div className="animated-arrow" style={{ '--path': `"M${sx},${sy} Q${cx},${cy} ${ex},${ey}"` } as React.CSSProperties}>
            <svg part="svg-arrow" stroke="#000" fill="#000" strokeWidth={3} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                <circle r={4} cx={sx} cy={sy} style={{ pointerEvents: 'none' }}></circle>
                <path fill="none" d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} style={{ pointerEvents: 'none' }}></path>
                <polygon points="0,-6 12,0,0,6" transform={`translate(${ex},${ey}) rotate(${ae * (180 / Math.PI)})`} style={{ pointerEvents: 'none' }}></polygon>
            </svg>
        </div>
    );
}