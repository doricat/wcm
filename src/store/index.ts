import { atom } from "jotai";
import type { TransportTaskMapModel, TransportTaskStatisticalData } from "../types/transportTask";
import type { Area } from "../types/area";
import type { LocationModel, LocationMapElementModel } from "../types/location";
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

export const areasAtom = atom<Area[]>([
    { code: '2002', name: '2002', type: '' },
    { code: '2003', name: '2003', type: '' },
    { code: '2003X', name: '2003X', type: '' },
    { code: '1007', name: '1007', type: '' },
    { code: '1001', name: '1001', type: '' },
    { code: '1002', name: '1002', type: '' },
    { code: '2002B', name: '2002B', type: '' },
    { code: '2003B', name: '2003B', type: '' },
    { code: '1001B', name: '1001B', type: '' },
    { code: '1007B', name: '1007B', type: '' },
    { code: '23H', name: '23H', type: '' },
    { code: '22J', name: '22J', type: '' },
    { code: '21D', name: '21D', type: '' },
]);

export const locationsAtom = atom<LocationModel[]>([]);

export const mapLocationsAtom = atom<LocationMapElementModel[]>([
    { code: 'A001', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002', externalCode: '', level: 1, x: 1504, y: 199, w: 100, h: 100 },
    { code: 'B011', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007B', externalCode: '', level: 1, x: 39, y: 199, w: 100, h: 100 },
    { code: 'B012', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007B', externalCode: '', level: 1, x: 143, y: 200, w: 100, h: 100 },
    { code: 'B013', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007B', externalCode: '', level: 1, x: 248, y: 199, w: 100, h: 100 },
    { code: 'B014', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007B', externalCode: '', level: 1, x: 353, y: 199, w: 100, h: 100 },
    { code: 'A006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007', externalCode: '', level: 1, x: 353, y: 444, w: 100, h: 100 },
    { code: 'A005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1002', externalCode: '', level: 1, x: 538, y: 201, w: 100, h: 100 },
    { code: 'B010', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 718, y: 201, w: 100, h: 100 },
    { code: 'B009', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 943, y: 199, w: 100, h: 100 },
    { code: 'B008', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 943, y: 59, w: 100, h: 100 },
    { code: 'A004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001', externalCode: '', level: 1, x: 838, y: 59, w: 100, h: 100 },
    { code: '2003X', shelfModels: ['1212', '1313'], enabled: false, areaCode: '2003X', externalCode: '', level: 1, x: 1179, y: 199, w: 100, h: 100 },
    { code: 'A003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003X', externalCode: '', level: 1, x: 1179, y: 304, w: 100, h: 100 },
    { code: 'A002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003', externalCode: '', level: 1, x: 1304, y: 199, w: 100, h: 100 },
    { code: 'B005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1689, y: 199, w: 100, h: 100 },
    { code: 'B001', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1859, y: 199, w: 100, h: 100 },
    { code: 'B002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1964, y: 199, w: 100, h: 100 },
    { code: 'B003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 2069, y: 199, w: 100, h: 100 },
    { code: 'B004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 2174, y: 199, w: 100, h: 100 },
    { code: 'B006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003B', externalCode: '', level: 1, x: 1859, y: 424, w: 100, h: 100 },
    { code: 'B007', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003B', externalCode: '', level: 1, x: 1964, y: 424, w: 100, h: 100 },
    { code: 'C013', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1784, y: 924, w: 100, h: 100 },
    { code: 'C014', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1889, y: 924, w: 100, h: 100 },
    { code: 'C015', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1994, y: 924, w: 100, h: 100 },
    { code: 'C016', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2204, y: 924, w: 100, h: 100 },
    { code: 'C017', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2309, y: 924, w: 100, h: 100 },
    { code: 'C001', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1784, y: 1119, w: 100, h: 100 },
    { code: 'C002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1889, y: 1119, w: 100, h: 100 },
    { code: 'C003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1994, y: 1119, w: 100, h: 100 },
    { code: 'C004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2099, y: 1119, w: 100, h: 100 },
    { code: 'C005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2204, y: 1119, w: 100, h: 100 },
    { code: 'C006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2309, y: 1119, w: 100, h: 100 },
    { code: 'C007', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1784, y: 1224, w: 100, h: 100 },
    { code: 'C008', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1889, y: 1224, w: 100, h: 100 },
    { code: 'C009', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 1994, y: 1224, w: 100, h: 100 },
    { code: 'C010', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2099, y: 1224, w: 100, h: 100 },
    { code: 'C011', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2204, y: 1224, w: 100, h: 100 },
    { code: 'C012', shelfModels: ['1212', '1313'], enabled: true, areaCode: '23H', externalCode: '', level: 1, x: 2309, y: 1224, w: 100, h: 100 },
    { code: 'D001', shelfModels: ['1212', '1313'], enabled: true, areaCode: '22J', externalCode: '', level: 1, x: 1784, y: 1424, w: 100, h: 100 },
    { code: 'D002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '21D', externalCode: '', level: 1, x: 1889, y: 1424, w: 100, h: 100 },
    { code: 'D003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '21D', externalCode: '', level: 1, x: 1994, y: 1424, w: 100, h: 100 },
    { code: 'D004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '21D', externalCode: '', level: 1, x: 2099, y: 1424, w: 100, h: 100 },
    { code: 'D005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '21D', externalCode: '', level: 1, x: 2204, y: 1424, w: 100, h: 100 },
    { code: 'D006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '21D', externalCode: '', level: 1, x: 2309, y: 1424, w: 100, h: 100 }
]);

export const shelvesAtom = atom<ShelfMapElementModel[]>([
    { code: '2003X', model: '1212', enabled: false, locationCode: '2003X' },
    { code: 'S01', model: '1212', enabled: true, locationCode: null },
    { code: 'S02', model: '1212', enabled: true, locationCode: 'A001' },
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