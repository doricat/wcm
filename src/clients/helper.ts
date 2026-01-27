import { publish } from "../store/event";
import type { ApiResult } from "../types/api";
import { EventTypes } from "../types/event";

export async function doFetch<T>(url: string, defValue: T, init?: RequestInit, globalLoading: boolean = false, loadingKey: string = EventTypes.globalLoading) {
    try {
        if (globalLoading) {
            publish(loadingKey, true);
        }

        const resp = await fetch(url, init);

        if (globalLoading) {
            publish(loadingKey, false);
        }

        if (resp.headers.get('content-type')?.startsWith('application/json')) {
            const json = await resp.json();
            if (!json) {
                return defValue;
            }

            const result = json as unknown as ApiResult;
            if (result.status === 'success') {
                if (typeof defValue === 'boolean') {
                    return true as T;
                }

                if (typeof defValue === 'object') {
                    return json['value'] as T;
                }

            } else {
                publish(EventTypes.globalError, result.message);
            }
        } else {
            publish(EventTypes.globalError, resp.status);
        }
    } catch (error) {
        console.log(error);
        // publish(EventTypes.globalError, error);
    }

    return defValue;
}