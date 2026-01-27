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