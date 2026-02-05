import dayjs from "dayjs";

export function generateTaskCode() {
    return `BY${dayjs(new Date()).format('YYYYMMDDHHmmss')}`;
}