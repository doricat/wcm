import type { Rectangle } from "./rectangle";

export interface MapElementLayerCtrl {
    area: boolean;
    location: boolean;
    shelf: boolean;
    inventory: boolean;
    transportTask: boolean;
}

export function getLocationStyle(element: Rectangle) {
    return {
        translate: `${element.x}px ${element.y}px`,
        width: `${element.w}px`,
        height: `${element.h}px`
    };
}

export function intersect(element: Rectangle, offsetX: number, offsetY: number, bounds: Rectangle) {
    return element.x + offsetX + element.w >= bounds.x && element.y + offsetY + element.h >= bounds.y && element.x + offsetX <= bounds.x + bounds.w && element.y + offsetY <= bounds.y + bounds.h;
}