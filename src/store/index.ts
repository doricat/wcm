import { atom } from "jotai";
import type { TransportTaskMapModel, TransportTaskStatisticalData } from "../types/transportTask";
import type { AreaMapElementModel } from "../types/area";
import type { LocationMapElementModel } from "../types/location";
import type { ShelfMapElementModel } from "../types/shelf";
import type { InventoryMapModel } from "../types/inventory";
import { transportTaskStatuses } from "../types/enums";
import type { MapElementLayerCtrl, RectangleMapElement } from "../types/map";

export const globalAlertAtom = atom<string[]>([]);

export const layerCtrlAtom = atom<MapElementLayerCtrl>({
    area: true,
    location: true,
    shelf: true,
    stock: true,
    transportTask: false
});

export const scaleAtom = atom<number>(1);

export const areasAtom = atom<AreaMapElementModel[]>([]);

export const locationsAtom = atom<LocationMapElementModel[]>([]);

export const shelvesAtom = atom<ShelfMapElementModel[]>([]);

export const inventoriesAtom = atom<InventoryMapModel[]>([]);

export const transportTasksAtom = atom<TransportTaskMapModel[]>([]);

export const hiddenRectanglesAtom = atom<RectangleMapElement[]>([]);

export const transportTaskStatisticalDataAtom = atom<TransportTaskStatisticalData>(get => {
    const tasks = get(transportTasksAtom);
    const pending = tasks.filter(x => x.status === transportTaskStatuses.pending).length;
    const exceptional = tasks.filter(x => x.status === transportTaskStatuses.exceptional).length;
    const executing = tasks.filter(x => x.status === transportTaskStatuses.executing).length;
    return { pending, exceptional, executing };
});

export const exceptionalShelfQtyAtom = atom<number>(get => {
    const shelves = get(shelvesAtom);
    return shelves.filter(x => x.locationCode === null).length;
});

export const opendDialogAtom = atom<string[]>([]);

export const searchKeyWordAtom = atom<string>('');