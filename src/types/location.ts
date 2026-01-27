import type { Rectangle } from "./rectangle";

export interface LocationMapElementModel extends Rectangle {
    code: string;
    level: number;
    externalCode: string;
    shelfModels: string[];
    enabled: boolean;
    areaCode: string;
}

export function getLocationElementId(element: LocationMapElementModel) {
    return `${element.code}-location`;
}