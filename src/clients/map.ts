import type { AreaMapElementModel } from "../types/area";
import type { LocationMapElementModel } from "../types/location";
import type { ShelfMapElementModel } from "../types/shelf";
import type { InventoryMapModel } from "../types/inventory";
import type { TransportTaskMapModel } from "../types/transportTask";
import { doFetch } from "./helper";

export async function getAreas(): Promise<AreaMapElementModel[]> {
    const url = '/aras.json';
    return await doFetch(url, [], { method: 'get' });
}

export async function getLocations(): Promise<LocationMapElementModel[]> {
    const url = '/locations.json';
    return await doFetch(url, [], { method: 'get' });
}

export async function getShelves(): Promise<ShelfMapElementModel[]> {
    const url = '/shelves.json';
    return await doFetch(url, [], { method: 'get' });
}

export async function getInventories(): Promise<InventoryMapModel[]> {
    const url = '/inventories.json';
    return await doFetch(url, [], { method: 'get' });
}

export async function getTrasnportTasks(): Promise<TransportTaskMapModel[]> {
    const url = '/transportTasks.json';
    return await doFetch(url, [], { method: 'get' });
}