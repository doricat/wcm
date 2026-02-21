import type { LocationModel } from "../types/location";
import { doFetch } from "./helper";

export async function getHiddenLocations(): Promise<LocationModel[]> {
    const url = '/locations.json';
    return await doFetch(url, [], { method: 'get' });
}