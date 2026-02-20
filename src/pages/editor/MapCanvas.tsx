import { useAtom, useAtomValue } from "jotai";
import { useDrop } from "react-dnd";
import { inventoriesAtom, mapLocationsAtom, shelvesAtom } from "../../store";
import type { InventoryMapModel } from "../../types/inventory";
import { getLocationElementId, type Location } from "../../types/location";
import { LocationMapElement } from "../../components/LocationMapElement";
import { useCallback, useImperativeHandle, useRef, useState } from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";

export function MapCanvas({ ref }: { ref: React.Ref<{ saveLayout: () => void }>; }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [mapLocations, setMapLocations] = useAtom(mapLocationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const [targets, setTargets] = useState<Array<HTMLElement | SVGElement>>([]);
    const moveableRef = useRef<Moveable>(null);
    const selectoRef = useRef<Selecto>(null);
    const navigate = useNavigate();

    const [, drop] = useDrop(() => ({
        accept: 'location',
        drop: (item: Location, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const initialClientOffset = monitor.getInitialClientOffset();
            const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
            let offset: { x: number, y: number; } | null = null;
            if (clientOffset && initialClientOffset && initialSourceClientOffset) {
                const rect = canvasRef.current!.getBoundingClientRect();

                const itemCenterOffsetX = initialClientOffset.x - initialSourceClientOffset.x;
                const itemCenterOffsetY = initialClientOffset.y - initialSourceClientOffset.y;

                const finalCenterX = clientOffset.x - itemCenterOffsetX;
                const finalCenterY = clientOffset.y - itemCenterOffsetY;

                const x = finalCenterX - rect.left;
                const y = finalCenterY - rect.top;

                offset = { x, y };

                const location = { ...item, x, y, w: 100, h: 100 };
                setMapLocations(prev => {
                    return [...prev, location];
                });
            }

            return { code: 'MapCanvas', offset };
        }
    }));

    const setRef = useCallback((node: HTMLDivElement | null) => {
        canvasRef.current = node;
        drop(node);
    }, [drop]);

    const saveLayout = () => {
        const elements = document.querySelectorAll('.map-canvas .map-location-box');
        for (const item of elements) {
            const style = window.getComputedStyle(item);
            const transform = style.transform || 'none';
            if (transform === 'none') {
                continue;
            }

            const matrixStr = transform.match(/matrix(3d)?\((.*?)\)/);
            if (!matrixStr) {
                continue;
            }

            const matrixValues = matrixStr[2].split(/\s*,\s*/).map(Number);
            let x = matrixValues[4];
            let y = matrixValues[5];

            const translate = style.translate || 'none';
            if (translate !== 'none') {
                const translateValues = translate.split(/\s+/).map(x => Number.parseFloat(x.replace('px', '')));
                if (translateValues.length === 1) {
                    translateValues.push(0);
                }

                x += translateValues[0];
                y += translateValues[1];
            }

            x = Math.round(x);
            y = Math.round(y);

            const code = item.getAttribute('data-location-code');
            if (code) {
                const index = mapLocations.findIndex(x => x.code === code);
                if (index >= 0) {
                    const location = mapLocations[index];
                    mapLocations.splice(index, 1);
                    mapLocations.push({ ...location, x, y });

                    (item as HTMLDivElement).style.transform = 'none';
                }
            }
        }

        setMapLocations([...mapLocations]);
        setTargets([]);
        enqueueSnackbar('保存成功', { variant: 'success' });
        navigate('/');
    };

    useImperativeHandle(ref, () => ({
        saveLayout
    }));

    const locationElements = [];
    for (const location of mapLocations) {
        const shelf = shelves.find(x => x.locationCode == location.code);
        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        locationElements.push(<LocationMapElement key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} arriveTasks={[]} onlyShelf={false} selected={false} />);
    }

    return (
        <div style={{ width: 'calc(100vw - 210px)', height: '100vh', overflow: 'auto', position: 'relative' }}>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                snappable={true}
                snapGridWidth={5}
                snapGridHeight={5}
                isDisplayGridGuidelines={true}
                onClickGroup={e => {
                    if (selectoRef.current) {
                        selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                    }
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
            />
            <Selecto
                dragContainer={'.map-canvas'}
                selectableTargets={['.map-canvas .map-location-box']}
                hitRate={0}
                selectByClick={true}
                selectFromInside={false}
                ratio={0}
                continueSelect={false}
                toggleContinueSelect="shift"
                onDragStart={(e) => {
                    const target = e.inputEvent.target;
                    if ((target && moveableRef.current) && (moveableRef.current.isMoveableElement(target) || targets.some(x => x === target || x.contains(target)))) {
                        e.stop();
                    }
                }}
                onSelect={e => {
                    if (e.isDragStartEnd) {
                        return;
                    }
                    setTargets(e.selected);
                }}
                onSelectEnd={e => {
                    if (e.isDragStartEnd && moveableRef.current) {
                        e.inputEvent.preventDefault();
                        moveableRef.current.waitToChangeTarget().then(() => {
                            moveableRef.current!.dragStart(e.inputEvent);
                        });
                    }
                    setTargets(e.selected);
                }}
            />
            <div className="map-canvas" ref={setRef} style={{ width: '100vw', height: '100vh', margin: '16px', userSelect: 'none' }}>
                {locationElements}
            </div>
        </div>
    );
}