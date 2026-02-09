import { useEffect, useRef, useState } from "react";
import { LocationMapElement } from "../../components/LocationMapElement";
import Draggable, { type DraggableData } from "react-draggable";
import { useAtomValue, useSetAtom } from "jotai";
import { clickedLocationAtom, inventoriesAtom, locationsAtom, scaleAtom, selectedElementAtom, selectedLocationsAtom, shelvesAtom, transportTasksAtom } from "../../store";
import { getLocationElementId } from "../../types/location";
import { type Rectangle } from "../../types/rectangle";
import { intersect } from "../../types/map";
import type { InventoryMapModel } from "../../types/inventory";
import { LocationDialog } from "../../components/LocationDialog";
import { useDialog } from "../../hooks/useDialog";
import { TaskArrowManager } from "../../components/TaskArrowManager";

interface Props {
    mapW: number;
    mapH: number;
}

const borderWidth = 150;

export function ViewPort(props: Props) {
    const [viewBounds, setViewBounds] = useState<Rectangle>({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight });
    const dragNodeRef = useRef<HTMLDivElement | null>(null);
    const dialog = useDialog();

    const scale = useAtomValue(scaleAtom);
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const tasks = useAtomValue(transportTasksAtom);
    const selectedLocations = useAtomValue(selectedLocationsAtom);
    const setSelectedElement = useSetAtom(selectedElementAtom);
    const setClickedLocation = useSetAtom(clickedLocationAtom);

    const canvasW = Math.round(props.mapW * scale) + borderWidth * 2;
    const canvasH = Math.round(props.mapH * scale) + borderWidth * 2;
    const draggableBounds = {
        left: canvasW <= viewBounds.w ? 0 : viewBounds.w - canvasW,
        right: canvasW <= viewBounds.w ? viewBounds.w - canvasW : 0,
        top: canvasH <= viewBounds.h ? 0 : viewBounds.h - canvasH,
        bottom: canvasH <= viewBounds.h ? viewBounds.h - canvasH : 0
    };

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

    const handleClick = async (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, isDoubleClick: boolean) => {
        evt.preventDefault();
        if (evt.target) {
            const locationCode = (evt.target as HTMLDivElement).getAttribute('data-location-code');
            if (locationCode) {
                if (isDoubleClick) {
                    await dialog.open(LocationDialog, { code: locationCode });
                } else {
                    setClickedLocation(locationCode);

                    const shelf = shelves.find(x => x.locationCode === locationCode);
                    if (shelf) {
                        const b = tasks.some(x => x.shelfCode === shelf.code);
                        if (shelf.enabled && !b) {
                            setSelectedElement({ code: shelf.code, type: 'shelf' });
                        }
                    } else {
                        const location = locations.find(x => x.code === locationCode);
                        const b = tasks.some(x => x.endLocationCode === locationCode);
                        if (location && location.enabled && !b) {
                            setSelectedElement({ code: locationCode, type: 'location' });
                        }
                    }
                }
            }
        }
    };

    const locationElements = [];
    for (const location of locations) {
        if (!intersect(location, borderWidth, borderWidth, scale, viewBounds)) {
            continue;
        }

        const leaveTask = tasks.find(x => x.startLocationCode === location.code);
        const arriveTasks = tasks.filter(x => x.endLocationCode === location.code);

        let shelf = shelves.find(x => x.locationCode == location.code);
        if (!shelf && arriveTasks.length > 0) {
            shelf = shelves.find(x => x.code == arriveTasks[0].shelfCode && x.locationCode == null);
        }

        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        const selected = selectedLocations.some(x => x === location.code);

        locationElements.push(<LocationMapElement key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} arriveTasks={arriveTasks} leaveTask={leaveTask} onlyShelf={scale <= 0.42} selected={selected} />);
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0 }} >
            <Draggable nodeRef={dragNodeRef} bounds={draggableBounds} onStop={handleDragStop}>
                <div style={{ position: 'relative', width: `${canvasW}px`, height: `${canvasH}px` }} ref={dragNodeRef}>
                    <div style={{ width: `${props.mapW}px`, height: `${props.mapH}px`, translate: `${borderWidth}px ${borderWidth}px`, transformOrigin: 'left top', scale: scale, position: 'absolute' }} onDoubleClick={x => handleClick(x, true)} onClick={x => handleClick(x, false)}>
                        {locationElements}
                    </div>
                    <div style={{ width: `${props.mapW}px`, height: `${props.mapH}px`, translate: `${borderWidth}px ${borderWidth}px`, transformOrigin: 'left top', scale: scale, position: 'absolute', pointerEvents: 'none' }}>
                        <TaskArrowManager />
                    </div>
                </div>
            </Draggable>
        </div>
    );
}