import { generateTaskCode } from "../utils";
import { transportTaskStatuses } from "./enums";
import type { LocationMapElementModel } from "./location";
import type { ShelfMapElementModel } from "./shelf";

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
    externalTaskCode: string | null;
    agvCode: string | null;
    shelfAngle: number | null;
    priority: number | null;
    createdBy: string | null;
    createdAt: Date;
    leavedAt: Date | null;
    arrivedAt: Date | null;
    scheduledAt: Date | null;
    message: string | null;
}

export interface TransportTaskStatisticalData {
    pending: number;
    exceptional: number;
    executing: number;
}

export function canTriggerStart(task: TransportTaskMapModel) {
    return task.status >= transportTaskStatuses.pending && task.status < transportTaskStatuses.renewable && task.leavedAt == null;
}

export function canTriggerEnd(task: TransportTaskMapModel) {
    return task.status >= transportTaskStatuses.pending && task.status < transportTaskStatuses.renewable && task.leavedAt != null;
}

export function canContinue(task: TransportTaskMapModel) {
    return task.status == transportTaskStatuses.renewable;
}

export function canRepeat(task: TransportTaskMapModel) {
    return task.status == transportTaskStatuses.executing && task.leavedAt == null;
}

export function canAbort(task: TransportTaskMapModel) {
    return task.status >= transportTaskStatuses.pending && task.status <= transportTaskStatuses.renewable;
}

export function createNew(shelfCode: string, toLocationCode: string, shelves: ShelfMapElementModel[], locations: LocationMapElementModel[]) {
    const shelf = shelves.find(x => x.code === shelfCode);
    if (!shelf) {
        throw new Error('Shelf not found.');
    }

    if (!shelf.locationCode) {
        throw new Error('Shelf location not found.');
    }

    const startLocation = locations.find(x => x.code == shelf.locationCode);
    if (!startLocation) {
        throw new Error('Start location not found.');
    }

    const endLocation = locations.find(x => x.code == toLocationCode);
    if (!endLocation) {
        throw new Error('End location not found.');
    }

    return {
        code: generateTaskCode(),
        shelfCode: shelfCode,
        startAreaCode: startLocation.areaCode,
        endAreaCode: endLocation.areaCode,
        startLocationCode: startLocation.code,
        endLocationCode: toLocationCode,
        businessTypeCode: 'F01',
        businessTypeName: '货架调度',
        status: transportTaskStatuses.executing,
        externalTaskCode: null,
        agvCode: null,
        shelfAngle: null,
        priority: 127,
        createdBy: '管理员',
        createdAt: new Date(),
        leavedAt: null,
        arrivedAt: null,
        scheduledAt: new Date(),
        message: null
    };
}

export function triggerTaskStart(task: TransportTaskMapModel) {
    task.leavedAt = new Date();
    task.message = '被管理员触发开始';
}

export function triggerTaskEnd(task: TransportTaskMapModel) {
    task.status = transportTaskStatuses.completed;
    task.arrivedAt = new Date();
    task.message = '被管理员触发结束';
}

export function abortTask(task: TransportTaskMapModel) {
    task.status = transportTaskStatuses.aborted;
    task.message = '被管理员中断';
}