export function getStatusName(status: number, obj: { [key: number]: string }) {
    return Object.hasOwn(obj, status) ? obj[status] : null;
}

export function getTransportTaskStatusName(status: number) {
    return getStatusName(status, transportTaskStatusNames);
}

export const EventTypes = {
    globalError: 'globalError',
    globalLoading: 'globalLoading',
} as const;

export const transportTaskStatuses = {
    aborted: -1,
    pending: 0,
    exceptional: 1,
    executing: 2,
    renewable: 3,
    completed: 4
} as const;

const transportTaskStatusNames: { [key: number]: string } = {
    0: '待执行',
    1: '异常',
    2: '执行中',
    3: '可继续',
    4: '已完成'
};
transportTaskStatusNames[-1] = '已中断';