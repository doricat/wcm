import { useEffect, useRef, useState } from "react";
import { LocationMapElement } from "../../components/LocationMapElement";
import Draggable, { type DraggableData } from "react-draggable";
import { useAtomValue } from "jotai";
import { locationsAtom, shelvesAtom } from "../../store";
import { getLocationElementId } from "../../types/location";
import { type Rectangle } from "../../types/rectangle";
import { intersect } from "../../types/map";

interface Props {
    canvasW: number;
    canvasH: number;
}

const borderWidth = 150;

export function ViewPort(props: Props) {
    const [viewBounds, setViewBounds] = useState<Rectangle>({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight });
    const dragNodeRef = useRef<HTMLDivElement | null>(null);

    // const scale = useAtomValue(scaleAtom);
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const canvasW = props.canvasW + borderWidth * 2;
    const canvasH = props.canvasH + borderWidth * 2;
    const draggableBounds = {
        left: canvasW <= viewBounds.w ? 0 : viewBounds.w - canvasW,
        right: canvasW <= viewBounds.w ? viewBounds.w - canvasW : 0,
        top: canvasH <= viewBounds.h ? 0 : viewBounds.h - canvasH,
        bottom: canvasH <= viewBounds.h ? viewBounds.h - canvasH : 0
    };

    console.log(draggableBounds);

    useEffect(() => {
        const handleResize = () => {
            setViewBounds({ x: viewBounds.x, y: viewBounds.y, w: window.innerWidth, h: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDragStop = (_: unknown, data: DraggableData) => {
        const bounds = {
            x: canvasW <= viewBounds.w ? 0 : Math.abs(data.x),
            y: canvasH <= viewBounds.h ? 0 : Math.abs(data.y),
            w: viewBounds.w,
            h: viewBounds.h
        };

        setViewBounds(bounds);
    };

    const handleClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, isDoubleClick: boolean) => {
        evt.preventDefault();
        if (evt.target) {
            const locationCode = (evt.target as HTMLDivElement).getAttribute('data-location-code');
            if (locationCode) {
                console.log(locationCode);
            }
        }
    };

    const locationElements = [];
    for (const location of locations) {
        if (intersect(location, borderWidth, borderWidth, viewBounds)) {
            const shelf = shelves.find(x => x.locationCode == location.code) ?? null;
            locationElements.push(<LocationMapElement key={getLocationElementId(location)} location={location} shelf={shelf} inventories={[]} arriveTasks={[]} leaveTask={null} />);
        }
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0 }} >
            <Draggable nodeRef={dragNodeRef} bounds={draggableBounds} onStop={handleDragStop}>
                <div style={{ position: 'relative', width: `${canvasW}px`, height: `${canvasH}px` }} ref={dragNodeRef}>
                    <div style={{ width: `${props.canvasW}px`, height: `${props.canvasH}px`, translate: `${borderWidth}px ${borderWidth}px` }} onDoubleClick={x => handleClick(x, true)} onClick={x => handleClick(x, false)}>
                        {locationElements}
                    </div>
                </div>
            </Draggable>
        </div>
    );
}