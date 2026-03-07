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
import type { PolygonAnnotation, TextAnnotation } from "../types/annotation";

export const globalAlertAtom = atom<string | null>();

export const layerCtrlAtom = atom<MapElementLayerCtrl>({
    area: true,
    location: true,
    shelf: true,
    inventory: true,
    transportTask: false
});

export const mapSizeAtom = atom<{ w: number; h: number; }>({ w: 2639, h: 1584 });

export const scaleAtom = atom<number>(0.56);

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
    { code: 'A006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1007', externalCode: '', level: 1, x: 354, y: 444, w: 100, h: 100 },
    { code: 'A005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1002', externalCode: '', level: 1, x: 538, y: 201, w: 100, h: 100 },
    { code: 'B010', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 714, y: 201, w: 100, h: 100 },
    { code: 'B009', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 943, y: 199, w: 100, h: 100 },
    { code: 'B008', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001B', externalCode: '', level: 1, x: 943, y: 59, w: 100, h: 100 },
    { code: 'A004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '1001', externalCode: '', level: 1, x: 829, y: 54, w: 100, h: 100 },
    { code: '2003X', shelfModels: ['1212', '1313'], enabled: false, areaCode: '2003X', externalCode: '', level: 1, x: 1179, y: 199, w: 100, h: 100 },
    { code: 'A003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003X', externalCode: '', level: 1, x: 1179, y: 304, w: 100, h: 100 },
    { code: 'A002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003', externalCode: '', level: 1, x: 1304, y: 199, w: 100, h: 100 },
    { code: 'B005', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1689, y: 199, w: 100, h: 100 },
    { code: 'B001', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1859, y: 199, w: 100, h: 100 },
    { code: 'B002', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 1964, y: 199, w: 100, h: 100 },
    { code: 'B003', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 2069, y: 199, w: 100, h: 100 },
    { code: 'B004', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2002B', externalCode: '', level: 1, x: 2174, y: 199, w: 100, h: 100 },
    { code: 'B006', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003B', externalCode: '', level: 1, x: 1859, y: 444, w: 100, h: 100 },
    { code: 'B007', shelfModels: ['1212', '1313'], enabled: true, areaCode: '2003B', externalCode: '', level: 1, x: 1964, y: 444, w: 100, h: 100 },
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
    { code: 'S01', model: '1212', enabled: true, locationCode: 'B001' },
    { code: 'S02', model: '1212', enabled: true, locationCode: null },
    { code: 'S03', model: '1313', enabled: true, locationCode: null }
]);

export const inventoriesAtom = atom<InventoryMapModel[]>([
    { code: 'L001', shelfCode: 'S01', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300056460', materialName: '燃油蒸汽隔离阀', batchNo: '260128', qty: 20, status: 0 },
    { code: 'L002', shelfCode: 'S02', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300054260', materialName: '碳罐', batchNo: '260131', qty: 20, status: 0 },
    { code: 'L003', shelfCode: 'S02', supplierCode: '000000', supplierName: '默认供应商', materialCode: 'B300054260', materialName: '碳罐', batchNo: '260131', qty: 20, status: 0 }
]);

export const transportTasksAtom = atom<TransportTaskMapModel[]>([
    { code: 'BY001', shelfCode: 'S02', startAreaCode: '2002', endAreaCode: '21D', startLocationCode: 'A001', endLocationCode: 'D004', businessTypeCode: 'K', businessTypeName: '货架返空', status: 2, externalTaskCode: '', agvCode: null, shelfAngle: null, priority: 127, createdBy: '管理员', createdAt: new Date('2026-03-07T20:45:00+08:00'), leavedAt: new Date('2026-03-07T20:45:30+08:00'), arrivedAt: null, scheduledAt: new Date('2026-03-07T20:45:00+08:00'), message: null },
    { code: 'BY002', shelfCode: 'S01', startAreaCode: '2002B', endAreaCode: '2002', startLocationCode: 'B001', endLocationCode: 'A001', businessTypeCode: 'B', businessTypeName: '上线补料', status: 2, externalTaskCode: '', agvCode: null, shelfAngle: null, priority: 127, createdBy: '管理员', createdAt: new Date('2026-03-07T20:46:00+08:00'), leavedAt: null, arrivedAt: null, scheduledAt: new Date('2026-03-07T20:46:00+08:00'), message: null },
]);

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

export const selectedTasksAtom = atom<{ locationCode?: string; taskCode?: string; } | null>({ locationCode: 'A001' });

export const polygonAnnotationsAtom = atom<PolygonAnnotation[]>([
    { id: '0', type: 'area', areaCode: '1007B', x: 29, y: 190, w: 433, h: 119, backgroundColor: 'aliceblue' },
    { id: '1', type: 'area', areaCode: '23H', x: 1774, y: 914, w: 645, h: 425, backgroundColor: 'aliceblue' },
    { id: '2', type: null, areaCode: null, x: 29, y: 320, w: 2390, h: 100, backgroundColor: 'beige' },
    { id: '100', type: 'area', areaCode: '1007', x: 344, y: 434, w: 120, h: 120, backgroundColor: 'aliceblue' },
    { id: '102', type: 'area', areaCode: '1002', x: 529, y: 194, w: 120, h: 115, backgroundColor: 'aliceblue' },
    { id: '104', type: 'area', areaCode: '1001B', x: 704, y: 194, w: 120, h: 115, backgroundColor: 'aliceblue' },
    { id: '105', type: 'area', areaCode: '1001B', x: 934, y: 49, w: 120, h: 260, backgroundColor: 'aliceblue' },
    { id: '107', type: 'area', areaCode: '1001', x: 824, y: 49, w: 110, h: 110, backgroundColor: 'aliceblue' },
    { id: '109', type: 'area', areaCode: '2003X', x: 1169, y: 189, w: 120, h: 220, backgroundColor: 'aliceblue' },
    { id: '111', type: 'area', areaCode: '2003', x: 1294, y: 189, w: 120, h: 120, backgroundColor: 'aliceblue' },
    { id: '113', type: 'area', areaCode: '2002', x: 1494, y: 189, w: 120, h: 120, backgroundColor: 'aliceblue' },
    { id: '115', type: 'area', areaCode: '2002B', x: 1679, y: 189, w: 605, h: 120, backgroundColor: 'aliceblue' },
    { id: '117', type: 'area', areaCode: '2003B', x: 1849, y: 434, w: 225, h: 120, backgroundColor: 'aliceblue' },
    { id: '119', type: 'area', areaCode: '21D', x: 1889, y: 1414, w: 530, h: 120, backgroundColor: 'aliceblue' },
    { id: '121', type: 'area', areaCode: '22J', x: 1779, y: 1414, w: 100, h: 120, backgroundColor: 'aliceblue' },
    { id: '124', type: null, areaCode: null, x: 2479, y: 319, w: 110, h: 1215, backgroundColor: 'rgb(245, 245, 220)' }
]);

export const textAnnotationsAtom = atom<TextAnnotation[]>([
    { id: '21', content: '1 0 0 7 B', x: 80, y: 210, size: 80, w: 310, h: 80, color: 'blueviolet' },
    { id: '22', content: '23H', x: 1820, y: 970, size: 315, w: 579, h: 315, color: 'aqua' },
    { id: '23', content: '通道', x: 40, y: 349, size: 50, w: 100, h: 50, color: 'rgb(85, 188, 49)' },
    { id: '101', content: '1007', x: 344, y: 559, size: 20, w: 46, h: 20, color: 'rgb(24, 156, 230)' },
    { id: '103', content: '1002', x: 528, y: 174, size: 20, w: 46, h: 20, color: 'rgb(24, 141, 92)' },
    { id: '106', content: '1001B', x: 949, y: 169, size: 20, w: 58, h: 20, color: 'rgb(42, 131, 169)' },
    { id: '108', content: '1001', x: 824, y: 29, size: 20, w: 46, h: 20, color: 'rgb(17, 65, 231)' },
    { id: '110', content: '2003X', x: 1171, y: 169, size: 20, w: 58, h: 20, color: 'rgb(54, 32, 141)' },
    { id: '112', content: '2003', x: 1298, y: 169, size: 20, w: 46, h: 20, color: 'rgb(0, 0, 0)' },
    { id: '114', content: '2002', x: 1494, y: 169, size: 20, w: 46, h: 20, color: 'rgb(46, 188, 69)' },
    { id: '116', content: '2 0 0 2 B', x: 1723, y: 214, size: 75, w: 291, h: 75, color: 'rgb(204, 18, 119)' },
    { id: '118', content: '2003B', x: 1854, y: 459, size: 75, w: 216, h: 75, color: 'rgb(204, 22, 22)' },
    { id: '120', content: '2 1 D', x: 2233, y: 1439, size: 75, w: 171, h: 75, color: 'rgb(34, 56, 173)' },
    { id: '122', content: '22J', x: 1754, y: 1444, size: 75, w: 126, h: 75, color: 'rgb(216, 19, 160)' },
    { id: '123', content: '通道', x: 2304, y: 349, size: 50, w: 100, h: 50, color: 'rgb(85, 188, 49)' },
    { id: '125', content: '通道', x: 2479, y: 349, size: 50, w: 100, h: 50, color: 'rgb(85, 188, 49)' },
    { id: '126', content: '1001B', x: 709, y: 174, size: 20, w: 58, h: 20, color: 'rgb(42, 131, 169)' }
]);