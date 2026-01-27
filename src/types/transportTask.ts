export interface TransportTaskMapModel {
    code: string;
    shelfCode: string;
    startAreaCode: string | null;
    endAreaCode: string;
    startLocationCode: string | null;
    endLocationCode: string;
    businessTypeCode: string;
    businessTypeName: string | null;
    status: number;
    createdAt: string;
}

export interface TransportTaskStatisticalData {
    pending: number;
    exceptional: number;
    executing: number;
}