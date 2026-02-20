import { atom } from "jotai";
import type { TransportTaskMapModel, TransportTaskStatisticalData } from "../types/transportTask";
import type { AreaMapElementModel } from "../types/area";
import type { Location, LocationMapElementModel } from "../types/location";
import type { ShelfMapElementModel } from "../types/shelf";
import type { InventoryMapModel } from "../types/inventory";
import { transportTaskStatuses } from "../types/enums";
import type { MapElementLayerCtrl } from "../types/map";
import type { Material } from "../types/material";
import type { Supplier } from "../types/supplier";

export const globalAlertAtom = atom<string | null>();

export const layerCtrlAtom = atom<MapElementLayerCtrl>({
    area: true,
    location: true,
    shelf: true,
    inventory: true,
    transportTask: false
});

export const scaleAtom = atom<number>(1);

export const areasAtom = atom<AreaMapElementModel[]>([
    { code: 'A1', name: 'A1', type: '' }
]);

export const locationsAtom = atom<Location[]>([
    { code: 'L12', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L12', level: 1 },
    { code: 'L13', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L13', level: 1 },
    { code: 'L14', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L14', level: 1 }
]);

export const mapLocationsAtom = atom<LocationMapElementModel[]>([
    { code: 'L01', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L01', level: 1, x: 0, y: 0, w: 100, h: 100 },
    { code: 'L02', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L02', level: 1, x: 110, y: 0, w: 100, h: 100 },
    { code: 'L03', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L03', level: 1, x: 220, y: 0, w: 100, h: 100 },
    { code: 'L04', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L04', level: 1, x: 330, y: 500, w: 100, h: 100 },
    { code: 'L05', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L05', level: 1, x: 550, y: 0, w: 100, h: 100 },
    { code: 'L06', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L06', level: 1, x: 660, y: 0, w: 100, h: 100 },
    { code: 'L07', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L07', level: 1, x: 770, y: 0, w: 100, h: 100 },
    { code: 'L08', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L08', level: 1, x: 880, y: 0, w: 100, h: 100 },
    { code: 'L09', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L09', level: 1, x: 990, y: 0, w: 100, h: 100 },
    { code: 'L10', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L10', level: 1, x: 1100, y: 0, w: 100, h: 100 },
    { code: 'L11', shelfModels: ['1212', '1313'], enabled: true, areaCode: 'A1', externalCode: 'L11', level: 1, x: 1210, y: 0, w: 100, h: 100 }
]);

export const shelvesAtom = atom<ShelfMapElementModel[]>([
    { code: 'S01', model: '1212', enabled: true, locationCode: null },
    { code: 'S02', model: '1212', enabled: true, locationCode: 'L02' },
    { code: 'S03', model: '1313', enabled: true, locationCode: null }
]);

export const inventoriesAtom = atom<InventoryMapModel[]>([
    { code: 'L001', shelfCode: 'S01', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300056460', materialName: '燃油蒸汽隔离阀', batchNo: '260128', qty: 20, status: 0 },
    { code: 'L002', shelfCode: 'S02', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300054260', materialName: '碳罐', batchNo: '260131', qty: 20, status: 0 },
    { code: 'L003', shelfCode: 'S02', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300054260', materialName: '碳罐', batchNo: '260131', qty: 20, status: 0 }
]);

export const transportTasksAtom = atom<TransportTaskMapModel[]>([]);

export const shelfModelsAtom = atom<string[]>(['1212', '1313', '1317']);

export const materialsAtom = atom<Material[]>([
    { code: 'B300054260', name: '碳罐', type: 'small-part' },
    { code: 'B300056460', name: '燃油蒸汽隔离阀', type: 'large-part' },
    { code: 'Z900538160', name: 'DCDC高压电缆', type: 'large-part' },
    { code: 'B300063460', name: '管路总成', type: 'large-part' },
    { code: 'V500044260', name: '后空调中段制冷管', type: 'large-part' },
    { code: 'V500044360', name: '后空调后端制冷管', type: 'large-part' },
    { code: 'B100176760', name: '冷却水管-连接管总成', type: 'large-part' },
    { code: 'Z900321960', name: '蓄电池正极电缆', type: 'small-part' },
    { code: 'B100138960', name: '驱动电机出水管', type: 'small-part' },
    { code: 'B100213360', name: '散热器进水管', type: 'small-part' },
    { code: 'E200040960', name: '后螺旋弹簧', type: 'large-part' },
    { code: 'E200002660', name: '后螺旋弹簧下支撑座橡胶垫', type: 'large-part' },
    { code: 'E200002560', name: '后螺旋弹簧上座橡胶垫', type: 'large-part' }
]);

export const supplersAtom = atom<Supplier[]>([
    { code: '000000', name: '默认供应商' }
]);

export const transportTaskStatisticalDataAtom = atom<TransportTaskStatisticalData>(get => {
    const tasks = get(transportTasksAtom);
    const pending = tasks.filter(x => x.status === transportTaskStatuses.pending).length;
    const exceptional = tasks.filter(x => x.status === transportTaskStatuses.exceptional).length;
    const executing = tasks.filter(x => x.status === transportTaskStatuses.executing || x.status === transportTaskStatuses.renewable).length;
    return { pending, exceptional, executing };
});

export const exceptionalShelfQtyAtom = atom<number>(get => {
    const shelves = get(shelvesAtom);
    const tasks = get(transportTasksAtom);
    return shelves.filter(x => x.locationCode === null && !tasks.some(y => y.shelfCode === x.code && y.status >= transportTaskStatuses.pending && y.status <= transportTaskStatuses.renewable)).length;
});

export const selectedLocationsAtom = atom<string[]>([]);

export const selectedTasksAtom = atom<{ locationCode?: string; taskCode?: string; } | null>(null);