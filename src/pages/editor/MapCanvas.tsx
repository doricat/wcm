import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useDrop } from "react-dnd";
import { inventoriesAtom, mapLocationsAtom, mapSizeAtom, polygonAnnotationsAtom, shelvesAtom, textAnnotationsAtom } from "../../store";
import type { InventoryMapModel } from "../../types/inventory";
import { getLocationElementId, type LocationModel } from "../../types/location";
import { LocationMapElement } from "../../components/LocationMapElement";
import { useCallback, useImperativeHandle, useRef, useState } from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { Menu, Item, useContextMenu, type ItemParams, type TriggerEvent } from "react-contexify";
import { getAnnotationElementId, getPolygonAnnotationStyle, getTextAnnotationStyle } from "../../types/annotation";
import { useDialog } from "../../hooks/useDialog";
import { AddAnnotationDialog } from "./AddAnnotationDialog";
import { TextAnnotationPropDialog } from "./TextAnnotationPropDialog";
import { PolygonAnnotationPropDialog } from "./PolygonAnnotationPropDialog";

const menuId = 'def-menu';

function getOffsetAndSize(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    let x = 0;
    let y = 0;

    const transform = style.transform || 'none';
    if (transform !== 'none') {
        const matrixStr = transform.match(/matrix(3d)?\((.*?)\)/);
        if (!matrixStr) {
            return;
        }

        const matrixValues = matrixStr[2].split(/\s*,\s*/).map(Number);
        x = matrixValues[4];
        y = matrixValues[5];
    }

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
    const w = Math.round(Number.parseFloat(style.width.replace('px', '')));
    const h = Math.round(Number.parseFloat(style.height.replace('px', '')));

    return { x, y, w, h };
}

function checkAllowResize(elements: (HTMLElement | SVGElement)[]) {
    return elements.length === 1 && elements[0].tagName === 'DIV' && elements[0].getAttribute('data-annotation-id') != null;
}

export function MapCanvas({ ref }: { ref: React.Ref<{ saveLayout: () => void }>; }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const setMapSize = useSetAtom(mapSizeAtom);
    const [mapLocations, setMapLocations] = useAtom(mapLocationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const [polygonAnnotations, setPolygonAnnotations] = useAtom(polygonAnnotationsAtom);
    const [textAnnotations, setTextAnnotations] = useAtom(textAnnotationsAtom);
    const [targets, setTargets] = useState<Array<HTMLElement | SVGElement>>([]);
    const moveableRef = useRef<Moveable>(null);
    const selectoRef = useRef<Selecto>(null);
    const [size, setSize] = useState<{ w: number; h: number; init: boolean; }>({ w: 500, h: 500, init: true });
    const [contextMenuItemState, setContextMenuItemState] = useState<{ add: boolean; remove: boolean; }>({ add: false, remove: true });
    const navigate = useNavigate();
    const dialog = useDialog();
    const [editMode, setEditMode] = useState<'move-only' | 'move-resize'>('move-only');

    const [, drop] = useDrop(() => ({
        accept: 'location',
        drop: (item: LocationModel, monitor) => {
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
        let w = 0;
        let h = 0;

        const elements = document.querySelectorAll('.map-canvas .map-element');
        for (const item of elements) {
            const rect = getOffsetAndSize(item as HTMLElement);
            if (!rect) {
                continue;
            }

            do {
                const locationCode = item.getAttribute('data-location-code');
                if (locationCode) {
                    const index = mapLocations.findIndex(x => x.code === locationCode);
                    if (index >= 0) {
                        const location = mapLocations[index];
                        mapLocations.splice(index, 1);
                        mapLocations.push({ ...location, x: rect.x, y: rect.y });
                    }

                    break;
                }

                const id = item.getAttribute('data-annotation-id');
                if (id) {
                    if (item.tagName === 'DIV') {
                        const index = polygonAnnotations.findIndex(x => x.id === id);
                        if (index >= 0) {
                            const polygon = polygonAnnotations[index];
                            polygonAnnotations.splice(index, 1);
                            polygonAnnotations.push({ ...polygon, backgroundColor: (item as HTMLDivElement).style.backgroundColor, x: rect.x, y: rect.y, w: rect.w, h: rect.h });
                        }

                        break;
                    }

                    if (item.tagName === 'P') {
                        const index = textAnnotations.findIndex(x => x.id === id);
                        if (index >= 0) {
                            const text = textAnnotations[index];
                            textAnnotations.splice(index, 1);
                            textAnnotations.push({ ...text, size: Number.parseInt((item as HTMLParagraphElement).style.fontSize.replace('px', '')), color: (item as HTMLParagraphElement).style.color, x: rect.x, y: rect.y, w: rect.w, h: rect.h });
                        }

                        break;
                    }
                }

                // eslint-disable-next-line no-constant-condition
            } while (false);

            (item as HTMLElement).style.transform = 'none';

            w = Math.max(rect.x + rect.w, w);
            h = Math.max(rect.y + rect.h, h);
        }

        w += 50;
        h += 50;

        if (w > 50 && h > 50) {
            setMapSize({ w, h });
        }

        setPolygonAnnotations([...polygonAnnotations]);
        setTextAnnotations([...textAnnotations]);
        setMapLocations([...mapLocations]);
        enqueueSnackbar('保存成功', { variant: 'success' });
        navigate('/');
    };

    useImperativeHandle(ref, () => ({
        saveLayout
    }));

    const { show } = useContextMenu({
        id: menuId
    });

    const handleContextMenu = (event: React.MouseEvent) => {
        if (!event.target) {
            return;
        }

        let state = { add: false, remove: true };
        let b = true;
        const tagName = (event.target as HTMLElement).tagName;
        do {
            if (tagName === 'DIV') {
                const element = event.target as HTMLDivElement;
                if (element.className === 'map-canvas') {
                    break;
                }

                const locationCode = element.getAttribute('data-location-code');
                if (locationCode) {
                    b = false;
                    break;
                }
            }

            state = { add: true, remove: false };
            // eslint-disable-next-line no-constant-condition
        } while (false);

        if (b) {
            setContextMenuItemState(state);
            show({ event });
            setTargets([]);
        }
    };

    const handleAddAnnotation = async (evt: ItemParams<TriggerEvent, undefined>) => {
        await dialog.open(AddAnnotationDialog, { x: evt.triggerEvent.offsetX, y: evt.triggerEvent.offsetY });
    };

    const handleRemoveAnnotation = async (evt: ItemParams<TriggerEvent, undefined>) => {
        if (evt.triggerEvent.target) {
            const annotationId = (evt.triggerEvent.target as HTMLElement).getAttribute('data-annotation-id');
            if (annotationId) {
                const b = await dialog.confirm(`确定移除标注？`, { severity: 'warning' });
                if (b) {
                    const className = (evt.triggerEvent.target as HTMLElement).className;
                    if (className.includes('map-polygon-annotation')) {
                        const arr = polygonAnnotations.filter(x => x.id !== annotationId);
                        setPolygonAnnotations(arr);
                    } else if (className.includes('map-text-annotation')) {
                        const arr = textAnnotations.filter(x => x.id !== annotationId);
                        setTextAnnotations(arr);
                    }
                }
            }
        }
    };

    const openPropDialog = async (evt: ItemParams<TriggerEvent, undefined>) => {
        if (evt.triggerEvent.target) {
            const annotationId = (evt.triggerEvent.target as HTMLElement).getAttribute('data-annotation-id');
            if (annotationId) {
                const className = (evt.triggerEvent.target as HTMLElement).className;
                if (className.includes('map-polygon-annotation')) {
                    const annotation = polygonAnnotations.find(x => x.id === annotationId);
                    await dialog.open(PolygonAnnotationPropDialog, { element: evt.triggerEvent.target as HTMLDivElement, areaCode: annotation ? annotation.areaCode : null });
                } else if (className.includes('map-text-annotation')) {
                    await dialog.open(TextAnnotationPropDialog, { element: evt.triggerEvent.target as HTMLParagraphElement });
                }
            }
        }
    };

    const locationElements = [];
    let canvasW = 0;
    let canvasH = 0;

    for (const location of mapLocations) {
        const shelf = shelves.find(x => x.locationCode == location.code);
        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        locationElements.push(<LocationMapElement key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} arriveTasks={[]} onlyShelf={false} selected={false} className="map-location-box2 map-element" />);

        canvasW = Math.max(location.x + location.w, canvasW);
        canvasH = Math.max(location.y + location.h, canvasH);
    }

    const polygonAnnotationElements = [];
    for (const annotation of polygonAnnotations) {
        polygonAnnotationElements.push(<div key={getAnnotationElementId(annotation)} className="map-polygon-annotation map-element" style={getPolygonAnnotationStyle(annotation)} data-annotation-id={annotation.id}></div>);

        canvasW = Math.max(annotation.x + annotation.w, canvasW);
        canvasH = Math.max(annotation.y + annotation.h, canvasH);
    }

    const textAnnotationElements = [];
    for (const annotation of textAnnotations) {
        textAnnotationElements.push(<p key={getAnnotationElementId(annotation)} className="map-text-annotation map-element" style={getTextAnnotationStyle(annotation)} data-annotation-id={annotation.id}>{annotation.content}</p>);

        canvasW = Math.max(annotation.x + annotation.w, canvasW);
        canvasH = Math.max(annotation.y + annotation.h, canvasH);
    }

    if (size.init) {
        setSize({ w: canvasW + 100, h: canvasH + 100, init: false });
    }

    return (
        <div style={{ width: 'calc(100vw - 230px)', height: '100vh', overflow: 'auto', position: 'relative' }}>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                snappable={true}
                snapGridWidth={5}
                snapGridHeight={5}
                isDisplayGridGuidelines={true}
                bounds={{ top: 16, left: 16 }}
                resizable={editMode === 'move-resize'}
                onClickGroup={e => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                    const rect = getOffsetAndSize(e.target as HTMLDivElement);
                    if (rect) {
                        const w = Math.max(rect.x + rect.w, size.w);
                        const h = Math.max(rect.y + rect.h, size.h);

                        if (w > size.w || h > size.h) {
                            setSize({ w, h, init: false });
                        }
                    }
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });

                    const rect = getOffsetAndSize(e.currentTarget.controlBox as HTMLDivElement);
                    if (rect) {
                        const { width, height } = e.currentTarget.areaElement.style;
                        const w = Math.max(rect.x + Number.parseInt(width.replace('px', '')), size.w);
                        const h = Math.max(rect.y + Number.parseInt(height.replace('px', '')), size.h);

                        if (w > size.w || h > size.h) {
                            setSize({ w, h, init: false });
                        }
                    }
                }}
            />
            <Selecto
                ref={selectoRef}
                dragContainer={'.map-canvas'}
                selectableTargets={['.map-canvas .map-element']}
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
                    setEditMode(checkAllowResize(e.selected) ? 'move-resize' : 'move-only');
                }}
                onSelectEnd={e => {
                    if (e.isDragStartEnd && moveableRef.current) {
                        e.inputEvent.preventDefault();
                        moveableRef.current.waitToChangeTarget().then(() => {
                            moveableRef.current!.dragStart(e.inputEvent);
                        });
                    }
                    setTargets(e.selected);
                    setEditMode(checkAllowResize(e.selected) ? 'move-resize' : 'move-only');
                }}
            />
            <div className="map-canvas" ref={setRef} style={{ width: `${size.w}px`, height: `${size.h}px`, margin: '16px', userSelect: 'none' }} onContextMenu={handleContextMenu}>
                {polygonAnnotationElements}
                {textAnnotationElements}
                {locationElements}
            </div>

            <Menu id={menuId} animation="scale">
                <Item id="add" disabled={contextMenuItemState.add} onClick={handleAddAnnotation}>添加标注</Item>
                <Item id="remove" disabled={contextMenuItemState.remove} onClick={handleRemoveAnnotation}>移除标注</Item>
                <Item id="prop" disabled={contextMenuItemState.remove} onClick={openPropDialog}>属性</Item>
            </Menu>
        </div>
    );
}