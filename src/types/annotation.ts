import type { Rectangle } from "./rectangle";

export interface PolygonAnnotation extends Rectangle {
    id: string;
    type: 'area' | null;
    areaCode: string | null;
    backgroundColor: string | null;
};

export interface TextAnnotation extends Rectangle {
    id: string;
    content: string;
    color: string | null;
    size: number;
};

export function getAnnotationElementId(annotation: PolygonAnnotation | TextAnnotation) {
    return `annotation-${annotation.id}`;
}

export function getPolygonAnnotationStyle(annotation: PolygonAnnotation) {
    const props = {
        translate: `${annotation.x}px ${annotation.y}px`,
        width: `${annotation.w}px`,
        height: `${annotation.h}px`
    } as React.CSSProperties;

    if (annotation.backgroundColor) {
        props['backgroundColor'] = annotation.backgroundColor;
    }

    return props;
}

export function getTextAnnotationStyle(annotation: TextAnnotation) {
    const props = {
        translate: `${annotation.x}px ${annotation.y}px`,
        fontSize: `${annotation.size}px`
    } as React.CSSProperties;

    if (annotation.color) {
        props['color'] = annotation.color;
    }

    return props;
}