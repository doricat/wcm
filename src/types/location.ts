import type { Rectangle } from "./rectangle";

export interface LocationModel {
    code: string;
    level: number;
    externalCode: string;
    shelfModels: string[];
    enabled: boolean;
    areaCode: string;
}

export interface LocationMapElementModel extends LocationModel, Rectangle {

}

export function getLocationElementId(element: LocationModel) {
    return `${element.code}-location`;
}

export function getShelfModels(element: LocationMapElementModel) {
    return element.shelfModels.join(',');
}