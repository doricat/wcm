export interface InventoryMapModel {
    code: string;
    shelfCode: string;
    supplierCode: string;
    supplierName: string | null;
    materialCode: string;
    materialName: string | null;
    batchNo: string;
    qty: number;
    status: number;
}

export function groupByMaterial(list: InventoryMapModel[]) {
    return list.reduce((x, y) => {
        const arr = x.get(y.materialCode);
        if (arr) {
            arr.push(y);
        } else {
            x.set(y.materialCode, [y]);
        }

        return x;
    }, new Map<string, InventoryMapModel[]>());
}